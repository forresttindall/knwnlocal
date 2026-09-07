import { createClient } from "@sanity/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  defaultPageContent,
  isPageKey,
  pageMeta,
  type PageKey,
} from "@/lib/content/pageContent";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const preferredRegion = ["iad1", "pdx1", "sfo1", "nyc1"];

export async function OPTIONS(_req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": _req.headers.get("origin") || "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,accept,authorization",
      "access-control-max-age": "7200",
    },
  });
}

function sanityEnvGate(): string | null {
  const pid = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  const ds = (process.env.NEXT_PUBLIC_SANITY_DATASET || "").trim();
  const tok = (process.env.SANITY_API_TOKEN || "").trim();

  if (!/^[a-z0-9]{6,12}$/i.test(pid)) {
    return `NEXT_PUBLIC_SANITY_PROJECT_ID is invalid (got "${pid}", len=${pid.length}). Save it as a CONFIG variable (not Secret) with value q8pm75vw in Vercel Env Settings.`;
  }
  if (!/^[a-z0-9_\-]{2,40}$/i.test(ds)) {
    return `NEXT_PUBLIC_SANITY_DATASET is invalid (got "${ds}").`;
  }
  if (!tok) return "SANITY_API_TOKEN is empty.";
  const tokLenOk = tok.length >= 40 && tok.length <= 300;
  if (!tokLenOk || !/^sk[A-Za-z0-9]/.test(tok)) {
    return (
      `SANITY_API_TOKEN looks invalid (len=${tok.length}, starts=${tok.slice(0, 3)}). ` +
      `Expected 40-300 chars starting with "sk". DELETE the secret in Vercel and recreate cleanly.`
    );
  }
  return null;
}

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

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

function approxUtf8Bytes(s: string): number {
  let size = 0;
  for (let i = 0; i < s.length; i++) {
    const cp = s.charCodeAt(i);
    size += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp >= 0xd800 && cp < 0xe000 ? 4 : 3;
  }
  return size;
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

function isDataUrl(s: string): boolean {
  return /^data:image\//i.test(s);
}

function decodeDataUrl(v: string): { mime: string; bytes: Buffer; payloadLength: number } | null {
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
      ? Buffer.from(payload.replace(/\s+/g, ""), "base64")
      : Buffer.from(decodeURIComponent(payload), "utf-8");
  } catch {
    return null;
  }
  if (!bytes || bytes.length < 32) return null;
  if (bytes.length > 32 * 1024 * 1024) return null;
  const magic = bytes.slice(0, 12);
  const magicHex = magic.toString("hex");
  const isPng =
    magicHex.startsWith("89504e470d0a1a0a");
  const isJpg =
    magicHex.startsWith("ffd8ff");
  const isGif =
    magicHex.startsWith("47494638");
  const isWebp = magicHex.startsWith("52494646") && bytes.toString("ascii", 8, 12) === "WEBP";
  const isSvg = bytes
    .slice(0, 1024)
    .toString("utf-8")
    .replace(/^\s+<\?xml[^>]*\?>\s*/, "")
    .trimStart()
    .startsWith("<svg");
  const isIco = magicHex.startsWith("00000100") || magicHex.startsWith("00000200");
  const isAvif = /^000000206674797061766966|^0000001c6674797061766966|^000000[0-9a-f]{2}66747970/.test(magicHex);
  const likelyValidImage = isPng || isJpg || isGif || isWebp || isSvg || isIco || isAvif;
  if (!likelyValidImage) {
    const bytesStr = bytes.toString("utf8").slice(0, 128);
    if (/^https?:\/\//i.test(bytesStr) || bytesStr.includes("<html") || bytesStr.includes("<!doctype")) {
      return null;
    }
  }
  return { mime, bytes, payloadLength: bytes.length };
}

const ALLOWED_UPLOAD_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/bmp",
]);

async function uploadDataUrlAsSanityAssetAndReturnCdnUrl(
  client: ReturnType<typeof createClient>,
  value: string,
  log: { (s: string): void },
): Promise<string | null> {
  const decoded = decodeDataUrl(value);
  if (!decoded) return null;
  let mime = decoded.mime.toLowerCase();
  if (mime === "image/jpg") mime = "image/jpeg";
  const allowed = ALLOWED_UPLOAD_MIMES.has(mime);
  if (!allowed) {
    log(`asset_upload: skipped unsupported mime=${mime} bytes=${decoded.payloadLength}`);
    return null;
  }
  const ext =
    mime === "image/jpeg"
      ? "jpg"
      : mime === "image/svg+xml"
        ? "svg"
        : mime.replace(/^image\//, "").split(";")[0] || "bin";
  const filename = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const projectId = (client as unknown as { config(): { projectId?: string } }).config().projectId;
  const dataset = (client as unknown as { config(): { dataset?: string } }).config().dataset;

  try {
    const assetDoc = await client.assets.upload("image", decoded.bytes, {
      filename,
      contentType: mime,
    });
    if (assetDoc && typeof (assetDoc as any).url === "string") return (assetDoc as any).url as string;
    const docLevel = (assetDoc as any)?.document ?? assetDoc;
    const ref = (assetDoc as any)?._ref || docLevel?._id || (assetDoc as any)?._id || "";
    const idParts = ref
      ? ref
          .replace(/^image-/, "")
          .replace(/-png$/, ".png")
          .replace(/-jpg$/, ".jpg")
          .replace(/-jpeg$/, ".jpeg")
          .replace(/-webp$/, ".webp")
          .replace(/-gif$/, ".gif")
          .replace(/-svg$/, ".svg")
          .replace(/-avif$/, ".avif")
      : "";
    if (projectId && dataset && idParts) {
      return `https://cdn.sanity.io/images/${projectId}/${dataset}/${idParts}`;
    }
    log(`asset_upload: Sanity returned assetDoc with no derivable CDN URL. Keys: ${Object.keys(assetDoc || {}).join(",")}`);
    return null;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e ?? "");
    const status = (e as any)?.statusCode || (e as any)?.response?.statusCode || (e as any)?.status || 0;
    log(`asset_upload: FAILED mime=${mime} bytes=${decoded.payloadLength} status=${status} err=${msg.slice(0, 200)}`);
    return "__UPLOAD_FAILED__:" + decoded.payloadLength + ":" + status;
  }
}

async function upsertPageContent(pageKey: PageKey, changes: Record<string, string>) {
  const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "").trim();
  const token = (process.env.SANITY_API_TOKEN || "").trim();

  const reqId =
    "deploy-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8);
  const trace: string[] = [];
  const log = (s: string) => {
    const line = `[${reqId}] ${s}`;
    trace.push(line);
    try {
      console.log(line);
    } catch {}
  };
  log(`upsertPage: start pageKey=${pageKey} fields=${Object.keys(changes).length}`);

  const missing: string[] = [];
  if (!projectId) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) missing.push("NEXT_PUBLIC_SANITY_DATASET");
  if (!token) missing.push("SANITY_API_TOKEN");

  if (missing.length > 0) {
    throw new Error(
      `[${reqId}] Missing env vars: ${missing.join(", ")}. Trace:\n` + trace.join("\n"),
    );
  }

  const API_VERSION = "2026-07-15";

  const baseClient = createClient({
    projectId,
    dataset,
    token,
    apiVersion: API_VERSION,
    useCdn: false,
    withCredentials: false,
  } as Parameters<typeof createClient>[0]);

  const existing = await baseClient.fetch<{ _id: string } | null>(
    `*[_type == "sitePage" && pageKey == $pageKey][0]{_id}`,
    { pageKey },
  );

  const docId = existing?._id ?? `sitePage.${pageKey}`;
  const docExists = !!existing;
  log(`docId=${docId} exists=${docExists}`);

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
      log(`createIfNotExists ok`);
    } else {
      await baseClient
        .patch(docId)
        .set({
          title: pageMeta[pageKey].title,
          path: pageMeta[pageKey].path,
          updatedAt: new Date().toISOString(),
        })
        .commit();
      log(`meta patch ok`);
    }

    const entries: [string, string][] = [];
    let assetUploads = 0;
    let assetFailures: Array<{ field: string; bytes: number; status: number }> = [];
    for (const [k, v] of Object.entries(changes)) {
      if (isDataUrl(v)) {
        const start = Date.now();
        const maybeCdn = await uploadDataUrlAsSanityAssetAndReturnCdnUrl(
          baseClient,
          v,
          log,
        );
        if (maybeCdn && !maybeCdn.startsWith("__UPLOAD_FAILED__")) {
          entries.push([k, maybeCdn]);
          assetUploads += 1;
          log(`field ${k} uploaded in ${Date.now() - start}ms cdn=${maybeCdn.slice(0, 80)}`);
          continue;
        }
        if (maybeCdn && maybeCdn.startsWith("__UPLOAD_FAILED__")) {
          const parts = maybeCdn.split(":");
          const bytes = Number(parts[1]) || 0;
          const status = Number(parts[2]) || 0;
          assetFailures.push({ field: k, bytes, status });
          log(
            `field ${k} Sanity asset upload FAILED bytes=${bytes} status=${status}. keeping raw value (data-url) as fallback.`,
          );
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
      const start = Date.now();
      await baseClient.patch(docId).set(buildFieldsPatchBody(patchBody)).commit();
      commits += 1;
      log(
        `fields patch flush ok fields=${buffer.length} bytes=${bufferBytes} in ${Date.now() - start}ms`,
      );
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

    log(`upsertPage: done commits=${commits} assetUploads=${assetUploads} assetFailures=${assetFailures.length}`);
    return {
      commits,
      docId,
      assetUploads,
      assetFailures,
      trace,
      reqId,
    };
  } catch (e) {
    const msg =
      e instanceof Error
        ? `${e.message}\n\nDeploy trace (${reqId}):\n${trace.join("\n")}`
        : `Publishing failed (${reqId}): ${String(e ?? "")}\nTrace:\n${trace.join("\n")}`;
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
      const detail = [
        `SANITY_API_TOKEN cannot create new documents (permission "create" required).`,
        `The "sitePage" document for pageKey="${pageKey}" (docId="${docId}") does not exist in dataset="${dataset}" yet, so publishing it requires a create.`,
        `Other pages still missing their initial sitePage doc in this dataset: ${needCreatePages.join(", ") || "(none — only this page is missing)"}.`,
        `Fix: go to Sanity Manage → https://www.sanity.io/manage/project/${projectId}/api → Tokens → rotate SANITY_API_TOKEN with a role that grants Editor or create permissions on _type="sitePage" in dataset="${dataset}".`,
      ].join(" ");
      throw new Error(detail + `\n\nDeploy trace (${reqId}):\n` + trace.join("\n"));
    }
    throw new Error(msg);
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
  try {
    const envErr = sanityEnvGate();
    if (envErr) {
      return new NextResponse(
        "Bad configuration before publish:\n  • " + envErr,
        { status: 500 },
      );
    }

    let raw = "";
    try {
      raw = await req.text();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/body.*exceeded|payload.*too.*large|413/i.test(msg)) {
        return new NextResponse(
          "Publish payload is too large. Image swaps in the editor embed images as data-URLs. Instead of swapping a large photo in-editor, upload the image to Sanity Studio first and paste the final Sanity CDN URL (https://cdn.sanity.io/images/q8pm75vw/…).",
          { status: 413 },
        );
      }
      return new NextResponse(
        "Publish failed reading the payload: " + (msg || "Unknown."),
        { status: 400 },
      );
    }

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

      return json(
        {
          ok: true,
          pageKey,
          path: pageMeta[pageKey].path,
          changesDeployed: Object.keys(changes).length,
          changesPayloadKb: Math.max(1, Math.round(approxUtf8Bytes(raw) / 1024)),
          sanityAssetUploads: info.assetUploads,
          sanityAssetUploadFailures: info.assetFailures?.length ? info.assetFailures : 0,
          sanityPatchCommits: info.commits,
          deployTriggered: deploy.triggered,
          deployWarning: "warning" in deploy ? deploy.warning : undefined,
          traceId: info.reqId,
          env: process.env.NODE_ENV === "development" ? maskedEnvDiagnostics() : undefined,
        },
        {
          headers: {
            "x-deploy-stats": `${info.commits}c-${info.assetUploads}u-${info.assetFailures?.length || 0}f-${Object.keys(changes).length}f`,
            "x-deploy-trace": info.reqId || "n/a",
          },
        },
      );
    } catch (innerError) {
      const msg =
        innerError instanceof Error ? innerError.message : "Publishing failed.";

      if (isAuthError(innerError)) {
        const diag = maskedEnvDiagnostics();
        const help = [
          "Sanity rejected the SANITY_API_TOKEN (session/host mismatch or invalid token).",
          "Checklist:",
          "  1. In Vercel → Project → Settings → Environment Variables, confirm SANITY_API_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET are ALL set on the Production environment and match the same Sanity project.",
          `  2. Token's project must exactly match projectId=${diag.projectId}. Tokens are NOT portable across projects.`,
          `  3. Dataset ${diag.dataset} must exist under that projectId.`,
          `  4. Current token: ${diag.token}. Ensure it was generated at: https://www.sanity.io/manage/project/${diag.projectId.replace(
            /….*$/,
            "",
          )}api → Tokens → Editor role.`,
          "  5. After changing Vercel env vars, trigger a Redeploy (not just a git push re-run) because env vars are snapshotted at build-time for serverless functions.",
          "  6. If you are running an on-demand ISR revalidate after rolling secrets, clear Vercel's Data Cache under Storage → Cache.",
        ].join("\n");
        const body =
          process.env.NODE_ENV === "development"
            ? `${help}\n\nRaw error: ${msg}`
            : help;
        return new NextResponse(body, { status: 401 });
      }

      if (isPermissionCreateError(innerError)) {
        const pid = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
        return new NextResponse(
          `SANITY_API_TOKEN lacks CREATE permissions. Regenerate the token with Editor role at: https://www.sanity.io/manage/project/${pid}/api → Tokens.`,
          { status: 403 },
        );
      }

      const enriched =
        msg && /Unauthorized|Session does not match project host|token|401|403/i.test(msg)
          ? `Publish failed (Sanity auth). Check /api/deploy endpoint for the canary: ${msg}`
          : msg || "Publish failed (server error).";

      return new NextResponse(enriched, { status: 500 });
    }
  } catch (outerError) {
    const fallback =
      outerError instanceof Error ? outerError.message : String(outerError ?? "Publish failed.");
    return new NextResponse(
      "Publish crashed server-side: " + (fallback || "Unknown error."),
      { status: 500 },
    );
  }
}
