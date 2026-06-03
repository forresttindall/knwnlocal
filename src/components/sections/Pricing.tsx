import { HighlightedText } from "@/components/ui/HighlightedText";
import { PricingCard } from "@/components/ui/PricingCard";

export function Pricing({
  headline,
  tiers,
}: {
  headline: string;
  tiers: Array<{
    field: string;
    tier: string;
    price: string;
    cadence: string;
    features: string[];
    isPopular?: boolean;
  }>;
}) {
  return (
    <section
      id="pricing"
      className="text-white"
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%, #1a1530 0%, #0d0b1a 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
        <div className="flex flex-col gap-[56px]">
          <h2
            className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
            data-editable="true"
            data-field="pricing-headline"
          >
            <HighlightedText text={headline} variant="pill" />
          </h2>

          <div className="grid gap-[32px] md:grid-cols-2">
            {tiers.map((tier) => (
              <PricingCard
                key={tier.field}
                isPopular={tier.isPopular}
                tier={
                  <span data-editable="true" data-field={`${tier.field}-tier`}>
                    {tier.tier}
                  </span>
                }
                price={
                  <span data-editable="true" data-field={`${tier.field}-price`}>
                    {tier.price}
                  </span>
                }
                cadence={
                  <span data-editable="true" data-field={`${tier.field}-cadence`}>
                    {tier.cadence}
                  </span>
                }
                features={tier.features.map((feature, index) => (
                  <span
                    key={index}
                    data-editable="true"
                    data-field={`${tier.field}-feature-${index + 1}`}
                  >
                    {feature}
                  </span>
                ))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
