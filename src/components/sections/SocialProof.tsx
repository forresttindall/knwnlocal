import { HighlightedText } from "@/components/ui/HighlightedText";
import { QuoteCard } from "@/components/ui/QuoteCard";

export function SocialProof({
  headline,
  testimonials,
}: {
  headline: string;
  testimonials: Array<{
    quote: string;
    firstName: string;
    lastName: string;
    field: string;
  }>;
}) {
  return (
    <section className="text-black" style={{ background: "#ede9f8" }}>
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
        <div className="flex flex-col gap-[56px]">
          <h2
            className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
            data-editable="true"
            data-field="social-headline"
          >
            <HighlightedText text={headline} variant="pill" />
          </h2>

          <div className="grid gap-[32px] md:grid-cols-3">
            {testimonials.map((t, index) => (
              <QuoteCard
                key={t.field}
                variant="light"
                quote={t.quote}
                quoteField={`${t.field}-quote`}
                firstName={
                  <span data-editable="true" data-field={`${t.field}-first`}>
                    {t.firstName}
                  </span>
                }
                lastName={
                  <span data-editable="true" data-field={`${t.field}-last`}>
                    {t.lastName}
                  </span>
                }
                className="h-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
