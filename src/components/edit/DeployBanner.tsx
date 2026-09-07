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
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 115000);

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
      const payloadKb = Math.max(1, Math.round(new Blob([payloadStr]).size / 1024));

      let res: Response;
      try {
        res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json, text/plain;q=0.9, */*;q=0.01",
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
          const ctx =
            `POST ${endpoint} failed at the browser/network layer (no HTTP response received). ` +
            `Payload was ~${payloadKb} KB, ${Object.keys(payloadObj.changes).length} field(s). ` +
            `Likely causes: ` +
            `(1) the API route crashed with a bodyless 500 on the server → open browser DevTools → Network → re-publish and click the failed POST → Response tab. ` +
            `(2) Vercel Deployment Protection (SSO/Password) intercepted → turn it OFF in Vercel → Settings → Deployment Protection. ` +
            `(3) Image swap generated a >10MB base64 payload → upload the image to Sanity Studio first and paste the CDN URL instead of using the upload button.`;
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
