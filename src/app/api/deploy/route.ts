import { createClient } from "@sanity/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { gzip as _gzip } from "node:zlib";
import { promisify } from "node:util";

import {
  defaultPageContent,
  isPageKey,
  pageMeta,
  type PageKey,
} from "@/lib/content/pageContent";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const gzip = promisify(_gzip);

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

function normalizeStringRecord(
  value: Record<string, unknown> | null | undefined,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value ?? {}).filter(
      (entry): entry is [string, string] =>
        typeof entry[0] === "string" && typeof entry[1] === "string",
    ),
  );
}

function isPermissionCreateError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e ?? "");
  return /permission\s+"?create"?\s+required/i.test(msg) || /Insufficient permissions/i.test(msg);
}

function buildFieldsPatchBody(
  partial: Record<string, string>,
): { fields: Record<string, string> } {
  return { fields: { ...partial } };
}

function approxUtf8Bytes(s: string): number {
  return s.length;
}

function isDataUrl(s: string): boolean {
  return /^data:image\//i.test(s);
}

function decodeDataUrl(v: string): { mime: string; bytes: Buffer } | null {
  const m =
    /^data:([\w!#$&^_.+\-]+\/[\w!#$&^_.+\-]+(?:;[\w-]+=[\w-]+)*)?(;base64)?,(.*)$/i.exec(
      v,
    );
  if (!m) return null;
  const mime = (m[1] || "application/octet-stream").split(";")[0];
  const isBase64 = !!m[2];
  const payload = m[3];
  let bytes: Buffer;
  try {
    bytes = isBase64
      ? Buffer.from(payload, "base64")
      : Buffer.from(decodeURIComponent(payload), "utf-8");
  } catch {
    return null;
  }
  return { mime, bytes };
}

async function uploadDataUrlAsSanityAssetAndReturnCdnUrl(
  client: ReturnType<typeof createClient>,
  value: string,
): Promise<string | null> {
  const decoded = decodeDataUrl(value);
  if (!decoded) return null;
  const ext = (decoded.mime.split("/")[1] || "bin").split(";")[0];
  const filename = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const assetDoc = await client.assets.upload("image", decoded.bytes, {
    filename,
    contentType: decoded.mime,
  });
  const ref = assetDoc._ref || assetDoc._id;
  if (assetDoc.url) return assetDoc.url;
  const projectId = (client as unknown as { config(): { projectId?: string } }).config()
    .projectId;
  const dataset = (client as unknown as { config(): { dataset?: string } }).config()
    .dataset;
  if (!projectId || !dataset) return null;
  const idParts = ref ? ref.replace(/^image-/, "").replace(/-png$/, ".png").replace(/-jpg$/, ".jpg").replace(/-jpeg$/, ".jpeg").replace(/-webp$/, ".webp").replace(/-gif$/, ".gif") : "";
  return idParts ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${idParts}` : null;
}

async function upsertPageContent(pageKey: PageKey, changes: Record<string, string>) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;

  const missing: string[] = [];
  if (!projectId) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) missing.push("NEXT_PUBLIC_SANITY_DATASET");
  if (!token) missing.push("SANITY_API_TOKEN");

  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }

  const baseClient = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2025-02-06",
    useCdn: false,
  });

  const existing = await baseClient.fetch<{ _id: string } | null>(
    `*[_type == "sitePage" && pageKey == $pageKey][0]{_id}`,
    { pageKey },
  );

  const docId = existing?._id ?? `sitePage.${pageKey}`;
  const docExists = !!existing;

  try {
    if (!docExists) {
      await baseClient.createIfNotExists({
        _id: docId,
        _type: "sitePage",
        pageKey,
        title: pageMeta[pageKey].title,
        path: pageMeta[pageKey].path,
        fields: defaultPageContent[pageKey],
        createdAt: new Date().toISOString(),
      });
    }

    await baseClient
      .patch(docId)
      .set({
        title: pageMeta[pageKey].title,
        path: pageMeta[pageKey].path,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    const entries: [string, string][] = [];
    let assetUploads = 0;
    for (const [k, v] of Object.entries(changes)) {
      if (isDataUrl(v)) {
        const cdn = await uploadDataUrlAsSanityAssetAndReturnCdnUrl(baseClient, v);
        if (cdn) {
          entries.push([k, cdn]);
          assetUploads += 1;
          continue;
        }
      }
      entries.push([k, v]);
    }
    let commits = 1;

    const SMALL = 8;
    const MAX_BUFFER_BYTES = 2_500_000;

    let buffer: [string, string][] = [];
    let bufferBytes = 0;

    const flushBuffer = async () => {
      if (buffer.length === 0) return;
      const patchBody = Object.fromEntries(buffer);
      await baseClient.patch(docId).set(buildFieldsPatchBody(patchBody)).commit();
      commits += 1;
      buffer = [];
      bufferBytes = 0;
    };

    for (const [k, v] of entries) {
      const fieldBytes = approxUtf8Bytes(k) + approxUtf8Bytes(v);
      if (buffer.length >= SMALL || bufferBytes + fieldBytes > MAX_BUFFER_BYTES) {
        await flushBuffer();
      }
      buffer.push([k, v]);
      bufferBytes += fieldBytes;
    }
    await flushBuffer();

    return { commits, docId, assetUploads };
  } catch (e) {
    if (!docExists && isPermissionCreateError(e)) {
      const allPages = await baseClient
        .fetch<Array<{ _id: string; pageKey: string; title: string }>>(
          `*[_type == "sitePage"]{_id, pageKey, title}`,
        )
        .catch(() => []);
      const existingPageKeys = new Set(allPages.map((p) => p.pageKey));
      const needCreatePages = ["home", "youtube", "email", "podcast"].filter(
        (k) => !existingPageKeys.has(k),
      );
      const msg = [
        `SANITY_API_TOKEN cannot create new documents (permission "create" required).`,
        `The "sitePage" document for pageKey="${pageKey}" (docId="${docId}") does not exist in dataset="${dataset}" yet, so publishing it requires a create.`,
        `Other pages still missing their initial sitePage doc in this dataset: ${needCreatePages.join(", ") || "(none — only this page is missing)"}.`,
        `Fix: go to Sanity Manage → https://www.sanity.io/manage/project/${projectId}/api → Tokens → rotate SANITY_API_TOKEN with a role that grants Editor or create permissions on _type="sitePage" in dataset="${dataset}".`,
      ].join(" ");
      throw new Error(msg);
    }
    throw e;
  }
}

async function triggerVercelDeploy() {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHookUrl || deployHookUrl.includes("...")) {
    return {
      triggered: false,
      warning: "Vercel deploy hook is not configured, so publish skipped the deploy trigger.",
    };
  }

  try {
    const hookRes = await fetch(deployHookUrl, { method: "POST" });
    if (!hookRes.ok) {
      const msg = await hookRes.text().catch(() => "");
      return {
        triggered: false,
        warning: msg || "Vercel deploy hook failed.",
      };
    }
  } catch (error) {
    return {
      triggered: false,
      warning: error instanceof Error ? error.message : "Vercel deploy hook failed.",
    };
  }

  return { triggered: true };
}

export async function POST(req: Request) {
  const raw = await req.text().catch(() => "");
  type ReqBody = { pageKey?: string; changes?: Record<string, string> | null };
  let body: ReqBody = {};
  if (raw) {
    try {
      body = JSON.parse(raw) as ReqBody;
    } catch {
      body = {};
    }
  }

  if (!body?.pageKey || !isPageKey(body.pageKey)) {
    return new NextResponse("Missing or invalid pageKey.", { status: 400 });
  }

  const pageKey = body.pageKey;
  const changes = normalizeStringRecord(body.changes);

  if (Object.keys(changes).length === 0) {
    return new NextResponse("No content changes were provided.", { status: 400 });
  }

  try {
    const info = await upsertPageContent(pageKey, changes);
    try { revalidatePath(pageMeta[pageKey].path); } catch {}

    const deploy = await triggerVercelDeploy();

    return json({
      ok: true,
      pageKey,
      path: pageMeta[pageKey].path,
      changesDeployed: Object.keys(changes).length,
      sanityAssetUploads: info.assetUploads,
      sanityPatchCommits: info.commits,
      deployTriggered: deploy.triggered,
      deployWarning: "warning" in deploy ? deploy.warning : undefined,
    });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "Publishing failed.",
      { status: 500 },
    );
  }
}
