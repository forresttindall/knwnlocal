import { createClient, type SanityClient } from "@sanity/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { zlib } from "node:zlib";
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
    responseLimit: false,
  },
};

const gzip = promisify(zlib.gzip);

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

function isDataUrlMaybeImage(v: string): boolean {
  return /^data:image\//i.test(v);
}

type DecodedDataUrl = { mime: string; base64: string; bytes: Buffer };

function decodeDataUrl(v: string): DecodedDataUrl | null {
  const m = /^data:([\w!#$&^_.+\-]+\/[\w!#$&^_.+\-]+(?:;[\w-]+=[\w-]+)*)?(;base64)?,(.*)$/is.exec(v);
  if (!m) return null;
  const mime = m[1] || "application/octet-stream";
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
  return { mime, base64: isBase64 ? payload : bytes.toString("base64"), bytes };
}

function fieldsKeyed(
  partial: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(partial)) out[`fields.${k}`] = v;
  return out;
}

async function uploadDataUrlAsSanityAsset(
  client: SanityClient,
  value: string,
): Promise<string> {
  const decoded = decodeDataUrl(value);
  if (!decoded) return value;
  const ext = (decoded.mime.split("/")[1] || "bin").split(";")[0];
  const filename = `cms-image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const assetDoc = await client.assets.upload("image", decoded.bytes, {
    filename,
    contentType: decoded.mime.split(";")[0],
  });
  return JSON.stringify({
    _type: "image",
    asset: { _type: "reference", _ref: assetDoc._id },
    kind: "sanity-asset",
  });
}

async function writeChangesInBatches(
  client: SanityClient,
  docId: string,
  pageMetaFields: { title: string; path: string },
  changes: Record<string, string>,
  metadataOnly = false,
) {
  const entries = Object.entries(changes);

  if (entries.length === 0 || metadataOnly) {
    await client
      .patch(docId)
      .set({
        title: pageMetaFields.title,
        path: pageMetaFields.path,
        updatedAt: new Date().toISOString(),
      })
      .commit();
    return { commits: 1, assetUploads: 0 };
  }

  let assetUploads = 0;
  const resolved: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (isDataUrlMaybeImage(v)) {
      try {
        const stored = await uploadDataUrlAsSanityAsset(client, v);
        assetUploads += 1;
        resolved[k] = stored;
        continue;
      } catch {
        resolved[k] = v;
        continue;
      }
    }
    resolved[k] = v;
  }

  await client
    .patch(docId)
    .set({
      title: pageMetaFields.title,
      path: pageMetaFields.path,
      updatedAt: new Date().toISOString(),
    })
    .commit();

  const remaining = Object.entries(resolved);
  const CHUNK_KEYS = 5;
  let commits = 1;
  for (let i = 0; i < remaining.length; i += CHUNK_KEYS) {
    const chunk = Object.fromEntries(remaining.slice(i, i + CHUNK_KEYS));
    await client.patch(docId).set(fieldsKeyed(chunk)).commit();
    commits += 1;
  }
  return { commits, assetUploads };
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

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2025-02-06",
    useCdn: false,
  });

  const existing = await client.fetch<{ _id: string; fields?: Record<string, unknown> } | null>(
    `*[_type == "sitePage" && pageKey == $pageKey][0]{_id, fields}`,
    { pageKey },
  );

  const docId = existing?._id ?? `sitePage.${pageKey}`;
  const docExists = !!existing;

  try {
    if (!docExists) {
      await client.createIfNotExists({
        _id: docId,
        _type: "sitePage",
        pageKey,
        title: pageMeta[pageKey].title,
        path: pageMeta[pageKey].path,
        fields: defaultPageContent[pageKey],
        createdAt: new Date().toISOString(),
      });
    }

    const info = await writeChangesInBatches(
      client,
      docId,
      { title: pageMeta[pageKey].title, path: pageMeta[pageKey].path },
      changes,
    );

    return info;
  } catch (e) {
    if (!docExists && isPermissionCreateError(e)) {
      const allPages = await client
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
  let body: { pageKey?: string; changes?: Record<string, string> } | null = null;
  if (raw) {
    try {
      body = JSON.parse(raw) as typeof body;
    } catch {
      body = null;
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
    revalidatePath(pageMeta[pageKey].path);

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
