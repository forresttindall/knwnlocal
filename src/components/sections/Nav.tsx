import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function Nav({
  ctaLabel,
}: {
  ctaLabel: string;
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white text-black shadow-xs">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-[24px] py-[24px] md:px-[40px]">
        <Link href="/" className="text-[18px] tracking-[-0.02em]">
          <span className="font-bold">Knwn</span>
          <span className="font-normal">Local</span>
        </Link>

        <nav className="hidden items-center gap-[32px] text-black/70 md:flex">
          <Link className="text-[14px] font-medium hover:text-black" href="#problem">
            Problem
          </Link>
          <Link className="text-[14px] font-medium hover:text-black" href="#process">
            Process
          </Link>
          <Link className="text-[14px] font-medium hover:text-black" href="#pricing">
            Pricing
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
