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

export async function GET(_req: Request) {
  const diag = maskedEnvDiagnostics();
  const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "").trim();
  const token = (process.env.SANITY_API_TOKEN || "").trim();

  let sanityTokenCheck: { ok: boolean; status: number; body: string } = {
    ok: false,
    status: 0,
    body: "skipped",
  };

  if (projectId && token) {
    try {
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v2026-07-15/users/me`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const raw = await res.text();
      let sanitized = raw;
      try {
        const obj = JSON.parse(raw);
        delete obj?.email;
        delete obj?.name;
        delete obj?.id;
        delete obj?.picture;
        sanitized = JSON.stringify(obj);
      } catch {}
      sanityTokenCheck = {
        ok: res.ok,
        status: res.status,
        body: sanitized.slice(0, 1200),
      };
    } catch (e) {
      sanityTokenCheck = {
        ok: false,
        status: 0,
        body: e instanceof Error ? e.message : String(e),
      };
    }
  }

  return json({
    route: "deploy-env-check",
    nodeEnv: process.env.NODE_ENV || "<none>",
    runtime: process.env.NEXT_RUNTIME || "nodejs",
    timestamp: new Date().toISOString(),
    env: diag,
    projectHostnames: projectId
      ? {
          api: `https://${projectId}.api.sanity.io/`,
          cdn: `https://${projectId}.apicdn.sanity.io/`,
          sanityManage: `https://www.sanity.io/manage/project/${projectId}/api`,
        }
      : null,
    dataset,
    canary: sanityTokenCheck,
    canaryInterpretation:
      sanityTokenCheck.ok && sanityTokenCheck.status === 200
        ? "✅ Token belongs to projectId above. Auth is valid."
        : sanityTokenCheck.status === 401
        ? "❌ Token is rejected for projectId — it was issued by a DIFFERENT Sanity project OR the token is invalid. Regenerate it at the Sanity Manage URL above."
        : sanityTokenCheck.status === 403
        ? "⚠️ Token is valid but lacks permissions. Make it Editor role, not Viewer."
        : `⚠️ Unexpected token-check result (HTTP ${sanityTokenCheck.status}). Investigate raw body.`,
  });
}

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
  const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "").trim();
  const token = (process.env.SANITY_API_TOKEN || "").trim();

  const missing: string[] = [];
  if (!projectId) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) missing.push("NEXT_PUBLIC_SANITY_DATASET");
  if (!token) missing.push("SANITY_API_TOKEN");

  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }

  const API_VERSION = "2026-07-15";

  const apiHost = `https://${projectId}.api.sanity.io`;

  const baseClient = createClient({
    projectId,
    dataset,
    token,
    apiVersion: API_VERSION,
    useCdn: false,
    apiHost,
    withCredentials: false,
  } as Parameters<typeof createClient>[0]);

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

function isAuthError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e ?? "");
  return (
    /Unauthorized/i.test(msg) ||
    /Session does not match project host/i.test(msg) ||
    /invalid.*token/i.test(msg) ||
    /token.*invalid/i.test(msg) ||
    /forbidden/i.test(msg) ||
    /401/i.test(msg) ||
    /403/i.test(msg)
  );
}

function maskedEnvDiagnostics(): Record<string, string> {
  const pid = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  const ds = (process.env.NEXT_PUBLIC_SANITY_DATASET || "").trim();
  const tok = (process.env.SANITY_API_TOKEN || "").trim();
  const first = (s: string, n = 6) => (s.length > n ? s.slice(0, n) : s);
  const last = (s: string, n = 4) => (s.length > n ? s.slice(-n) : s);
  return {
    projectId: pid ? `${first(pid)}…${last(pid)} (len=${pid.length})` : "<MISSING>",
    dataset: ds || "<MISSING>",
    token: tok
      ? `sk…${last(tok)} (len=${tok.length}, starts=${first(tok, 3)})`
      : "<MISSING>",
  };
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
      env: process.env.NODE_ENV === "development" ? maskedEnvDiagnostics() : undefined,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Publishing failed.";
    if (isAuthError(error)) {
      const diag = maskedEnvDiagnostics();
      const help = [
        "Sanity rejected the SANITY_API_TOKEN (session/host mismatch or invalid token).",
        "Checklist:",
        "  1. In Vercel → Project → Settings → Environment Variables, confirm SANITY_API_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET are ALL set on the Production environment and match the same Sanity project.",
        `  2. Token's project must exactly match projectId=${diag.projectId}. Tokens are NOT portable across projects.`,
        `  3. Dataset ${diag.dataset} must exist under that projectId.`,
        `  4. Current token: ${diag.token}. Ensure it was generated at: https://www.sanity.io/manage/project/${diag.projectId.replace(/….*$/, "")}api → Tokens → Editor role.`,
        "  5. After changing Vercel env vars, trigger a Redeploy (not just a git push re-run) because env vars are snapshotted at build-time for serverless functions.",
        "  6. If you are running an on-demand ISR revalidate after rolling secrets, clear Vercel's Data Cache under Storage → Cache.",
      ].join("\n");
      const body =
        process.env.NODE_ENV === "development"
          ? `${help}\n\nRaw error: ${msg}`
          : help;
      return new NextResponse(body, { status: 401 });
    }
    return new NextResponse(msg, { status: 500 });
  }
}
