"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { StatCard } from "@/components/ui/StatCard";

type ChannelStat = {
  number: string;
  label: string;
};

type ChannelCard = {
  title: string;
  body: string;
};

type ChannelPageProps = {
  slug: "youtube" | "email" | "podcast";
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  stats: ChannelStat[];
  promiseHeadline: string;
  promiseCards: ChannelCard[];
  processHeadline: string;
  processSteps: string[];
  ctaHeadline: string;
  ctaBody: string;
};

const channelLinks = [
  { href: "/youtube", label: "YouTube" },
  { href: "/email", label: "Email" },
  { href: "/podcast", label: "Podcast" },
] as const;

export function ChannelPage({
  slug,
  eyebrow,
  headline,
  subhead,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  stats,
  promiseHeadline,
  promiseCards,
  processHeadline,
  processSteps,
  ctaHeadline,
  ctaBody,
}: ChannelPageProps) {
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

          <Button href={primaryCtaHref} variant="primary">
            {primaryCtaLabel}
          </Button>
        </div>
      </header>

      <main>
        <section className="bg-cream">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[32px] px-[24px] py-[72px] md:px-[40px]">
            <div className="text-[13px] font-medium text-ink/70">{eyebrow}</div>
            <h1 className="max-w-[960px] text-[40px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[56px]">
              <HighlightedText text={headline} variant="pill" />
            </h1>
            <p className="max-w-[760px] text-[18px] leading-[1.45] text-ink/80 md:text-[20px]">
              {subhead}
            </p>
            <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center">
              <Button href={primaryCtaHref} variant="primary">
                {primaryCtaLabel}
              </Button>
              <Button href={secondaryCtaHref} variant="secondary">
                {secondaryCtaLabel}
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-dark-radial text-paper">
          <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
            <div className="grid gap-y-[32px] md:grid-cols-3 md:gap-x-[48px]">
              {stats.map((stat) => (
                <StatCard
                  key={`${slug}-${stat.label}`}
                  number={stat.number}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
            <div className="flex flex-col gap-[56px]">
              <h2 className="max-w-[860px] text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]">
                <HighlightedText text={promiseHeadline} variant="block" />
              </h2>
              <div className="grid gap-[24px] md:grid-cols-3">
                {promiseCards.map((card) => (
                  <div
                    key={`${slug}-${card.title}`}
                    className="rounded-[20px] bg-violet-soft p-s7 shadow-sm"
                  >
                    <div className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
                      {card.title}
                    </div>
                    <p className="mt-s4 text-[16px] leading-[1.5] text-ink/80">
                      {card.body}
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
              <h2 className="max-w-[860px] text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]">
                <HighlightedText text={processHeadline} variant="pill" />
              </h2>
              <div className="flex flex-col gap-s7 md:flex-row md:items-center md:justify-between">
                {processSteps.map((step, index) => (
                  <div key={`${slug}-${step}`} className="flex items-center">
                    <ProcessStep
                      title={step}
                      className="md:h-[112px] md:w-[112px] md:text-[15px] xl:h-[128px] xl:w-[128px] xl:text-[16px]"
                    />
                    {index < processSteps.length - 1 ? (
                      <div className="hidden md:flex items-center">
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
              <h2 className="max-w-[860px] text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]">
                <HighlightedText text={ctaHeadline} variant="pill" />
              </h2>
              <p className="max-w-[720px] text-[18px] leading-[1.45] text-ink/80 md:text-[20px]">
                {ctaBody}
              </p>
              <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center">
                <Button href={primaryCtaHref} variant="primary">
                  {primaryCtaLabel}
                </Button>
                <Button href={secondaryCtaHref} variant="ghost">
                  {secondaryCtaLabel}
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
