import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
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
    <section
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%, #1a1530 0%, #0d0b1a 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
        <div className="flex w-full flex-col gap-[72px]">
          <div className="flex flex-col gap-[40px]">
            <div
              className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/70"
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

            <div className="flex flex-col gap-[20px] sm:flex-row sm:items-center">
              <Button
                href="#availability"
                variant="primary"
                data-editable="true"
                data-field="hero-cta-primary"
              >
                {primaryCta}
              </Button>
              <Button
                href="#pricing"
                variant="ghost"
                className="border-white text-white hover:bg-white hover:text-black"
                data-editable="true"
                data-field="hero-cta-secondary"
              >
                {secondaryCta}
              </Button>
            </div>

            <div className="flex flex-col gap-[20px] sm:flex-row sm:items-center sm:gap-[24px]">
              <div className="flex -space-x-3">
                {["LM", "AR", "TN", "JR", "CB"].map((initials) => (
                  <div
                    key={initials}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbd7e7] text-[12px] font-semibold tracking-[-0.02em] text-black ring-2 ring-[#0d0b1a]"
                    aria-hidden
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div
                className="text-[14px] leading-[1.45] text-white/75"
                data-editable="true"
                data-field="hero-trust"
              >
                {trustText}
              </div>
            </div>
          </div>

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
      </div>
    </section>
  );
}
