"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/Button";

type MobileMenuLink = {
  href: string;
  label: string;
};

export function MobileMenu({
  brandHref,
  links,
  activeHref,
  ctaHref,
  ctaLabel,
}: {
  brandHref: string;
  links: readonly MobileMenuLink[];
  activeHref?: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowX = "";
      document.body.style.overflow = "";
      document.body.style.overflowX = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overflowX = "clip";
    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "clip";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowX = "";
      document.body.style.overflow = "";
      document.body.style.overflowX = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-ink/12 bg-paper text-ink md:hidden"
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex flex-col gap-[4px]">
          <span className="block h-[2px] w-[18px] rounded-full bg-current" />
          <span className="block h-[2px] w-[18px] rounded-full bg-current" />
          <span className="block h-[2px] w-[18px] rounded-full bg-current" />
        </span>
      </button>

      {mounted
        ? createPortal(
            <div
              className={[
                "fixed inset-0 z-[90] overflow-hidden md:hidden",
                open ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
              aria-hidden={!open}
            >
              <button
                type="button"
                className={[
                  "absolute inset-0 bg-ink/30 transition-opacity duration-300 ease-out",
                  open ? "opacity-100" : "opacity-0",
                ].join(" ")}
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
              />

              <div
                className={[
                  "absolute inset-y-0 right-0 z-[1] flex w-screen max-w-screen flex-col isolate border-l border-ink/10 px-[24px] py-[20px] opacity-100 shadow-2xl transition-transform duration-300 ease-out",
                  open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <Link href={brandHref} className="text-[18px] tracking-[-0.02em]" onClick={() => setOpen(false)}>
                    <span className="font-bold">Knwn</span>
                    <span className="font-normal">Local</span>
                  </Link>

                  <button
                    type="button"
                    className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-ink/12 bg-paper text-ink"
                    aria-label="Close navigation menu"
                    onClick={() => setOpen(false)}
                  >
                    <span className="relative block h-[18px] w-[18px]">
                      <span className="absolute left-0 top-1/2 block h-[2px] w-[18px] -translate-y-1/2 rotate-45 rounded-full bg-current" />
                      <span className="absolute left-0 top-1/2 block h-[2px] w-[18px] -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                    </span>
                  </button>
                </div>

                <nav className="mt-[48px] flex flex-col gap-[14px]">
                  {links.map((link) => {
                    const isActive = link.href === activeHref;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={[
                          "border-b border-ink/10 py-[14px] text-[32px] font-semibold leading-[1] tracking-[-0.03em] transition-colors",
                          isActive ? "text-ink" : "text-ink/70",
                        ].join(" ")}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-[24px]">
                  <Button
                    href={ctaHref}
                    variant="primary"
                    className="w-full justify-between"
                    onClick={() => setOpen(false)}
                  >
                    {ctaLabel}
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
