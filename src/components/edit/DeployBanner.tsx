"use client";

import { Button } from "@/components/ui/Button";

import { useEditMode } from "./EditModeProvider";

export function DeployBanner() {
  const {
    pageKey,
    enabled,
    dirtyFields,
    values,
    deployStatus,
    setDeployStatus,
    deployError,
    setDeployError,
    clearDirty,
  } = useEditMode();

  if (!enabled) return null;
  if (dirtyFields.size === 0) return null;

  async function onDeploy() {
    setDeployError(null);
    setDeployStatus("pending");

    const endpoint = (() => {
      try {
        const base = window.location.origin;
        return new URL("/api/deploy", base).toString();
      } catch {
        return "/api/deploy";
      }
    })();

    const run = async (): Promise<void> => {
      const MAX_PUBLISH_PAYLOAD_MB = 10;
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 180_000);

      const payloadObj = {
        pageKey,
        changes: Array.from(dirtyFields).reduce<Record<string, string>>(
          (acc, field) => {
            acc[field] = values[field] ?? "";
            return acc;
          },
          {},
        ),
      };
      const payloadStr = JSON.stringify(payloadObj);
      const payloadBytes = new Blob([payloadStr]).size;
      const payloadKb = Math.max(1, Math.round(payloadBytes / 1024));
      const payloadMb = payloadBytes / (1024 * 1024);

      const dataUrlFields: Array<{ field: string; kb: number }> = [];
      for (const [f, v] of Object.entries(payloadObj.changes)) {
        if (/^data:image\//i.test(v)) {
          dataUrlFields.push({
            field: f,
            kb: Math.max(1, Math.round((v.length * 3) / 4 / 1024)),
          });
        }
      }

      if (payloadMb > MAX_PUBLISH_PAYLOAD_MB) {
        const breakdown = dataUrlFields
          .slice(0, 6)
          .map((f) => `  - ${f.field} ~${f.kb} KB`)
          .join("\n");
        const more = dataUrlFields.length > 6 ? `  - … +${dataUrlFields.length - 6} more images` : "";
        throw new Error(
          `Publish payload is too large (${payloadMb.toFixed(1)} MB, limit ${MAX_PUBLISH_PAYLOAD_MB} MB).\n\n` +
            `Image swaps in the editor embed photos as inline base64, which is 33% larger than raw bytes.\n` +
            `Offending fields (largest first):\n${breakdown}${more ? "\n" + more : ""}\n\n` +
            `How to fix: upload the image to Sanity Studio (https://www.sanity.io/manage/project/q8pm75vw/studio) → click the asset → copy the CDN URL (https://cdn.sanity.io/images/q8pm75vw/website-dataset/…) → paste that URL as the field value in the editor instead of using the image upload button. Then Publish.`,
        );
      }

      let res: Response;
      try {
        res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json, text/plain;q=0.9, */*;q=0.01",
            "x-publish-size-kb": String(payloadKb),
            "x-publish-images": String(dataUrlFields.length),
          },
          credentials: "same-origin",
          redirect: "follow",
          signal: ctrl.signal,
          keepalive: false,
          body: payloadStr,
        });
      } catch (err) {
        const base =
          err instanceof Error ? err.message : typeof err === "string" ? err : "Network error.";
        const lowLevel = /fetch failed|Failed to fetch|networkerror|TypeError/i.test(base);
        if (lowLevel) {
          const imgBreakdown =
            dataUrlFields.length > 0
              ? dataUrlFields
                  .slice(0, 4)
                  .map((f) => `${f.field}=${f.kb}KB`)
                  .join(", ")
              : "no inline image fields";
          const ctx =
            `POST ${endpoint} failed at the browser/network layer (no HTTP response received). ` +
            `Payload ~${payloadKb} KB (${payloadMb.toFixed(2)} MB), ${Object.keys(payloadObj.changes).length} field(s), inline-images: ${dataUrlFields.length} (${imgBreakdown}). ` +
            `Likely causes: ` +
            `(1) Vercel serverless function timed out (>60s) during Sanity asset upload → retry with smaller images or paste CDN URLs. ` +
            `(2) Vercel Deployment Protection (SSO/Password) intercepted → Settings → Deployment Protection → OFF. ` +
            `(3) Browser aborted the base64 body because it exceeds browser/form limits → paste Sanity CDN URL instead. ` +
            `(4) Server crashed with a bodyless 500 → open DevTools → Network → re-publish → click the failed red POST → Response tab → paste it back here (this version now always returns a body).`;
          throw new Error(ctx + `\n\n(underlying error: ${base})`);
        }
        throw err instanceof Error ? err : new Error(String(err));
      } finally {
        clearTimeout(timeout);
      }

      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        const isHtml = ct.includes("text/html") || ct.includes("challenge");
        const message = await res.text().catch(() => "");

        const looksLikeVercelProtection =
          isHtml ||
          /vercel|protection|sso|password|auth|login|sign.?in/i.test(message);

        if (looksLikeVercelProtection) {
          throw new Error(
            "Blocked by Vercel Protection. Go to Vercel → Project → Settings → Deployment Protection → disable Password Protection / SSO Protection for Production, or add your IP/email to the bypass list. Then retry.",
          );
        }

        if (res.status === 401) {
          throw new Error(
            message || "Sanity rejected the token. Hit /api/deploy for diagnostics.",
          );
        }

        if (res.status >= 500) {
          throw new Error(message || `Server error (HTTP ${res.status}).`);
        }

        throw new Error(message || `Deploy failed (HTTP ${res.status}).`);
      }

      const payload = (await res.json().catch(() => null)) as
        | { deployWarning?: string }
        | null;

      if (typeof payload?.deployWarning === "string" && payload.deployWarning) {
        setDeployError(payload.deployWarning);
      }
    };

    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await run();
        setDeployStatus("success");
        clearDirty();
        return;
      } catch (e) {
        lastErr = e;
        if (e instanceof DOMException && e.name === "AbortError") {
          lastErr = new Error(
            "Publish timed out waiting for Sanity + Vercel. The writes may still have committed — reload and verify in a minute.",
          );
          break;
        }
        if (attempt < 1) {
          await new Promise((r) => setTimeout(r, 750));
        }
      }
    }

    const msg =
      lastErr instanceof Error
        ? lastErr.message
        : typeof lastErr === "string"
        ? lastErr
        : "Deploy failed (network error).";

    setDeployError(msg);
    setDeployStatus("error");
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-paper shadow-sm">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-s6 px-s8 py-s4">
        <div className="flex flex-col gap-1">
          <div className="text-[14px] font-semibold tracking-[-0.02em] text-ink">
            Changes ready to deploy
          </div>
          <div className="text-[13px] text-ink/70">
            {dirtyFields.size} field{dirtyFields.size === 1 ? "" : "s"} modified
            {deployStatus === "pending" ? " • Deploying…" : null}
            {deployStatus === "success" ? " • Published live" : null}
          </div>
          {deployError ? (
            <div className="text-[13px] text-ink">{deployError}</div>
          ) : null}
        </div>

        <Button
          variant="primary"
          type="button"
          onClick={onDeploy}
          disabled={deployStatus === "pending"}
          className={deployStatus === "pending" ? "opacity-70" : ""}
        >
          Publish Changes
        </Button>
      </div>
    </div>
  );
}
