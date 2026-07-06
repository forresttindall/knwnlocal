import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function Nav({
  ctaLabel,
}: {
  ctaLabel: string;
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-paper/95 text-ink shadow-xs backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-6 px-[24px] py-[16px] md:px-[40px] md:py-[14px]">
        <Link href="/" className="text-[18px] tracking-[-0.02em]">
          <span className="font-bold">Knwn</span>
          <span className="font-normal">Local</span>
        </Link>

        <nav className="hidden items-center gap-[20px] text-black/70 md:flex">
          <Link className="text-[14px] font-medium hover:text-black" href="/youtube">
            YouTube
          </Link>
          <Link className="text-[14px] font-medium hover:text-black" href="/email">
            Email
          </Link>
          <Link className="text-[14px] font-medium hover:text-black" href="/podcast">
            Podcast
          </Link>
        </nav>

        <Button
          href="#availability"
          variant="primary"
          data-editable="true"
          data-field="nav-cta"
        >
          {ctaLabel}
        </Button>
      </div>
    </header>
  );
}
