"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { StatCard } from "@/components/ui/StatCard";
import { useEditMode } from "@/components/edit/EditModeProvider";
import { Footer } from "@/components/sections/Footer";
import { MobileMenu } from "@/components/sections/MobileMenu";

type ChannelPageProps = {
  slug: "youtube" | "email" | "podcast";
  fields: Record<string, string>;
  editable?: boolean;
};

const channelLinks = [
  { href: "/youtube", label: "YouTube" },
  { href: "/email", label: "Email" },
  { href: "/podcast", label: "Podcast" },
] as const;

function editableAttrs(editable: boolean, field: string) {
  if (!editable) {
    return {};
  }

  return {
    "data-editable": "true",
    "data-field": field,
  } as const;
}

export function ChannelPage({ slug, fields, editable = false }: ChannelPageProps) {
  const editMode = useEditMode();
  const values = editMode.values;
  const read = (field: string) => values[field] ?? fields[field] ?? "";

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 w-full bg-paper/95 text-ink shadow-xs backdrop-blur">
        <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[16px] md:px-[40px] md:py-[14px]">
          <div className="flex items-center justify-between gap-4 md:gap-6">
            <Link href="/" className="text-[18px] tracking-[-0.02em]">
              <span className="font-bold">Knwn</span>
              <span className="font-normal">Local</span>
            </Link>

            <nav className="hidden items-center gap-[24px] md:flex">
              {channelLinks.map((link) => {
                const isActive = link.href === `/${slug}`;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "text-[14px] font-medium transition-colors",
                      isActive ? "text-ink" : "text-ink/65 hover:text-ink",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <Button
              href={`mailto:hello@knwnlocal.com?subject=KnwnLocal%20${slug[0].toUpperCase()}${slug.slice(1)}`}
              variant="primary"
              className="hidden md:inline-flex"
              {...editableAttrs(editable, "nav-cta")}
            >
              {read("nav-cta")}
            </Button>

            <MobileMenu
              brandHref="/"
              links={channelLinks}
              activeHref={`/${slug}`}
              ctaHref={`mailto:hello@knwnlocal.com?subject=KnwnLocal%20${slug[0].toUpperCase()}${slug.slice(1)}`}
              ctaLabel={read("nav-cta")}
            />
          </div>
        </div>
      </header>

      <main>
        <section className="bg-cream">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[32px] px-[24px] py-[72px] md:px-[40px]">
            <div className="text-[13px] font-medium text-ink/70" {...editableAttrs(editable, "hero-eyebrow")}>
              {read("hero-eyebrow")}
            </div>
            <h1
              className="max-w-[960px] text-[40px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[56px]"
              {...editableAttrs(editable, "hero-headline")}
            >
              <HighlightedText text={read("hero-headline")} variant="pill" />
            </h1>
            <p
              className="max-w-[760px] text-[18px] leading-[1.45] text-ink/80 md:text-[20px]"
              {...editableAttrs(editable, "hero-subhead")}
            >
              {read("hero-subhead")}
            </p>
            <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center">
              <Button
                href={`mailto:hello@knwnlocal.com?subject=KnwnLocal%20${slug[0].toUpperCase()}${slug.slice(1)}`}
                variant="primary"
                {...editableAttrs(editable, "hero-cta-primary")}
              >
                {read("hero-cta-primary")}
              </Button>
              <Button
                href={slug === "youtube" ? "/email" : slug === "email" ? "/podcast" : "/youtube"}
                variant="secondary"
                {...editableAttrs(editable, "hero-cta-secondary")}
              >
                {read("hero-cta-secondary")}
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-dark-radial text-paper">
          <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
            <div className="grid gap-y-[32px] md:grid-cols-3 md:gap-x-[48px]">
              {[1, 2, 3].map((index) => (
                <StatCard
                  key={`${slug}-stat-${index}`}
                  number={
                    <span {...editableAttrs(editable, `hero-stat-${index}-number`)}>
                      {read(`hero-stat-${index}-number`)}
                    </span>
                  }
                  label={
                    <span {...editableAttrs(editable, `hero-stat-${index}-label`)}>
                      {read(`hero-stat-${index}-label`)}
                    </span>
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
            <div className="flex flex-col gap-[56px]">
              <h2
                className="max-w-[860px] text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
                {...editableAttrs(editable, "promise-headline")}
              >
                <HighlightedText text={read("promise-headline")} variant="block" />
              </h2>
              <div className="grid gap-[24px] md:grid-cols-3">
                {[1, 2, 3].map((index) => (
                  <div
                    key={`${slug}-promise-${index}`}
                    className="rounded-[20px] bg-violet-soft p-s7 shadow-sm"
                  >
                    <div
                      className="text-[20px] font-semibold tracking-[-0.02em] text-ink"
                      {...editableAttrs(editable, `promise-${index}-title`)}
                    >
                      {read(`promise-${index}-title`)}
                    </div>
                    <p
                      className="mt-s4 text-[16px] leading-[1.5] text-ink/80"
                      {...editableAttrs(editable, `promise-${index}-body`)}
                    >
                      {read(`promise-${index}-body`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-dark-radial text-paper">
          <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
            <div className="flex flex-col gap-[56px]">
              <h2
                className="max-w-[860px] text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
                {...editableAttrs(editable, "process-headline")}
              >
                <HighlightedText text={read("process-headline")} variant="pill" />
              </h2>
              <div className="flex items-start justify-between md:items-center md:justify-between">
                {[1, 2, 3].map((index) => (
                    <div key={`${slug}-step-${index}`} className="flex min-w-0 flex-1 items-start justify-center md:w-auto md:flex-none md:items-center">
                      <div {...editableAttrs(editable, `process-${index}-title`)}>
                        <ProcessStep
                          title={read(`process-${index}-title`)}
                          stepNumber={index}
                          className="md:h-[112px] md:w-[112px] md:text-[15px] xl:h-[128px] xl:w-[128px] xl:text-[16px]"
                        />
                      </div>
                      {index < 3 ? (
                        <div className="mt-[14px] flex shrink-0 items-center sm:mt-[16px] md:mt-0">
                          <div className="mx-[3px] h-0 w-[4px] border-t-2 border-dashed border-violet sm:w-[6px] md:mx-s3 md:w-[32px] xl:mx-s6 xl:w-[48px]" />
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-violet"
                          >
                            <path
                              d="M1 1.5L4.5 4L1 6.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-violet-soft">
          <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
            <div className="flex flex-col gap-[24px]">
              <h2
                className="max-w-[860px] text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
                {...editableAttrs(editable, "cta-headline")}
              >
                <HighlightedText text={read("cta-headline")} variant="pill" />
              </h2>
              <p
                className="max-w-[720px] text-[18px] leading-[1.45] text-ink/80 md:text-[20px]"
                {...editableAttrs(editable, "cta-body")}
              >
                {read("cta-body")}
              </p>
              <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center">
                <Button
                  href={`mailto:hello@knwnlocal.com?subject=KnwnLocal%20${slug[0].toUpperCase()}${slug.slice(1)}`}
                  variant="primary"
                  {...editableAttrs(editable, "hero-cta-primary")}
                >
                  {read("hero-cta-primary")}
                </Button>
                <Button
                  href={slug === "youtube" ? "/email" : slug === "email" ? "/podcast" : "/youtube"}
                  variant="ghost"
                  {...editableAttrs(editable, "hero-cta-secondary")}
                >
                  {read("hero-cta-secondary")}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
