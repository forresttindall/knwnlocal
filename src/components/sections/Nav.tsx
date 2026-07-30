import Link from "next/link";

import { MobileMenu } from "@/components/sections/MobileMenu";
import { Button } from "@/components/ui/Button";

const channelLinks = [
  { href: "/youtube", label: "Grow my YouTube Channel" },
  { href: "/email", label: "Monetize my Database" },
] as const;

export function Nav({
  ctaLabel = "Get Started",
  editable = true,
}: {
  ctaLabel?: string;
  editable?: boolean;
}) {
  const editAttrs = editable
    ? {
        "data-editable": "true" as const,
        "data-field": "nav-cta",
      }
    : {};

  return (
    <header className="sticky top-0 z-40 w-full bg-paper/95 text-ink shadow-xs backdrop-blur">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[16px] md:px-[40px] md:py-[14px]">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          <Link href="/" className="text-[18px] tracking-[-0.02em]">
            <span className="font-bold">Knwn</span>
            <span className="font-normal">Local</span>
          </Link>

          <nav className="hidden items-center gap-[20px] text-black/70 md:flex">
            {channelLinks.map((link) => (
              <Link key={link.href} className="text-[14px] font-medium hover:text-black" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            href="/#contact"
            variant="primary"
            className="hidden md:inline-flex"
            {...editAttrs}
          >
            {ctaLabel}
          </Button>

          <MobileMenu
            brandHref="/"
            links={channelLinks}
            ctaHref="/#contact"
            ctaLabel={ctaLabel}
          />
        </div>
      </div>
    </header>
  );
}
