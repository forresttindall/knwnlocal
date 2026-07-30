import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | KnwnLocal",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-[24px] py-[80px] text-ink">
      <div className="mx-auto w-full max-w-[640px] text-left">
        <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-violet">
          404
        </div>
        <h1 className="mt-s4 text-[40px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[56px]">
          This page moved or never existed.
        </h1>
        <p className="mt-s5 max-w-[520px] text-[18px] leading-[1.5] text-ink/75">
          If you were looking for something specific, try the homepage or one of the two channel pages.
        </p>
        <div className="mt-s7 flex flex-col items-start gap-[12px] sm:flex-row sm:items-center">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-violet px-[22px] py-[14px] text-[14px] font-semibold tracking-[-0.01em] text-paper transition-colors hover:bg-violet/90"
            href="/"
          >
            Back to home
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-paper px-[22px] py-[14px] text-[14px] font-semibold tracking-[-0.01em] text-ink transition-colors hover:bg-cream"
            href="/youtube"
          >
            YouTube Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
