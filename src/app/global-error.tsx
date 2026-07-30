"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).console?.error) {
      (window as any).console.error(
        "[knwnlocal] Global root error:",
        error?.message,
        error?.digest,
      );
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-cream px-[24px] py-[80px] text-ink">
          <div className="mx-auto w-full max-w-[640px] text-left">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-violet">
              Site error
            </div>
            <h1 className="mt-s4 text-[40px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[56px]">
              The site hit an error loading the page shell.
            </h1>
            <p className="mt-s5 max-w-[520px] text-[18px] leading-[1.5] text-ink/75">
              A hard refresh usually fixes this. If it keeps happening, clear your browser cache for this domain and reload.
            </p>
            {error?.message ? (
              <p className="mt-s4 text-[13px] text-ink/60">
                Details:{" "}
                <span className="font-mono">{error.message.slice(0, 140)}</span>
              </p>
            ) : null}
            <div className="mt-s7 flex flex-col items-start gap-[12px] sm:flex-row sm:items-center">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-full bg-violet px-[22px] py-[14px] text-[14px] font-semibold tracking-[-0.01em] text-paper transition-colors hover:bg-violet/90"
              >
                Reload
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-paper px-[22px] py-[14px] text-[14px] font-semibold tracking-[-0.01em] text-ink transition-colors hover:bg-cream"
              >
                Back to home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
