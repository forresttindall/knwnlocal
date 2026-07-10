"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { StatCard } from "@/components/ui/StatCard";
import { useEditMode } from "@/components/edit/EditModeProvider";

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
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-6 px-[24px] py-[16px] md:px-[40px] md:py-[14px]">
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
            {...editableAttrs(editable, "nav-cta")}
          >
            {read("nav-cta")}
          </Button>
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
              <div className="flex flex-col gap-s7 md:flex-row md:items-center md:justify-between">
                {[1, 2, 3].map((index) => (
                  <div key={`${slug}-step-${index}`} className="flex items-center">
                    <div {...editableAttrs(editable, `process-${index}-title`)}>
                      <ProcessStep
                        title={read(`process-${index}-title`)}
                        className="md:h-[112px] md:w-[112px] md:text-[15px] xl:h-[128px] xl:w-[128px] xl:text-[16px]"
                      />
                    </div>
                    {index < 3 ? (
                      <div className="hidden items-center md:flex">
                        <div className="mx-s3 h-0 w-[32px] border-t-2 border-dashed border-violet xl:mx-s6 xl:w-[48px]" />
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-violet"
                        >
                          <path
                            d="M9 1L13 5L9 9"
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

      <footer className="bg-dark-radial text-paper">
        <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[56px] md:px-[40px]">
          <div className="flex flex-col gap-[24px] md:flex-row md:items-center md:justify-between">
            <Link href="/" className="text-[18px] tracking-[-0.02em]">
              <span className="font-bold">Knwn</span>
              <span className="font-normal">Local</span>
            </Link>

            <div className="flex flex-wrap items-center gap-[24px] text-paper/80">
              {channelLinks.map((link) => (
                <Link
                  key={`${link.href}-footer`}
                  href={link.href}
                  className="text-[14px] font-medium hover:text-paper"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="text-[14px] text-paper/70">knwnlocal.com</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
