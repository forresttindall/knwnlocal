import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { LogoTicker } from "@/components/ui/LogoTicker";
import { StatCard } from "@/components/ui/StatCard";

export function Hero({
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  trustText,
  stats,
}: {
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryCta: string;
  secondaryCta: string;
  trustText: string;
  stats: Array<{ number: string; label: string; field: string }>;
}) {
  return (
    <section className="min-h-screen bg-dark-radial text-paper">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] pt-[72px] md:px-[40px]">
        <div className="flex flex-col gap-[40px] pb-[56px] md:pb-[72px]">
          <div
            className="text-[13px] font-medium text-paper/72"
            data-editable="true"
            data-field="hero-eyebrow"
          >
            {eyebrow}
          </div>

          <h1
            className="text-[64px] font-extrabold leading-[1.0] tracking-[-0.02em] md:text-[96px]"
            data-editable="true"
            data-field="hero-headline"
          >
            <HighlightedText text={headline} variant="pill" />
          </h1>

          <p
            className="max-w-[720px] text-[18px] leading-[1.45] text-white/80 md:text-[20px]"
            data-editable="true"
            data-field="hero-subhead"
          >
            {subhead}
          </p>

          <div className="flex flex-col items-start gap-[20px] sm:flex-row sm:items-center">
            <Button
              href="#contact"
              variant="primary"
              data-editable="true"
              data-field="hero-cta-primary"
            >
              {primaryCta}
            </Button>
            <Button
              href="/youtube"
              variant="secondary"
              data-editable="true"
              data-field="hero-cta-secondary"
            >
              {secondaryCta}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full pb-[8px] pt-0">
        <div className="mx-auto w-full max-w-[1120px] px-[24px] md:px-[40px]">
          <div
            className="text-[14px] leading-[1.45] text-white/75 md:text-[15px]"
            data-editable="true"
            data-field="hero-trust"
          >
            {trustText}
          </div>
        </div>
      </div>

      <div className="w-full py-[10px]">
        <LogoTicker />
      </div>

      <div className="mx-auto w-full max-w-[1120px] px-[24px] pb-[72px] pt-[56px] md:px-[40px] md:pt-[72px]">
        <div className="grid gap-y-[32px] md:grid-cols-4 md:gap-x-[56px]">
          {stats.map((stat) => (
            <div key={stat.field}>
              <StatCard
                number={
                  <span data-editable="true" data-field={`${stat.field}-number`}>
                    {stat.number}
                  </span>
                }
                label={
                  <span data-editable="true" data-field={`${stat.field}-label`}>
                    {stat.label}
                  </span>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
