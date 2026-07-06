import * as React from "react";

import { Button } from "./Button";

export function PricingCard({
  tier,
  price,
  cadence,
  features,
  isPopular,
}: {
  tier: React.ReactNode;
  price: React.ReactNode;
  cadence: React.ReactNode;
  features: React.ReactNode[];
  isPopular?: boolean;
}) {
  const cardClass = isPopular
    ? "rounded-[20px] bg-ink p-s7 text-paper shadow-pop ring-1 ring-violet/25"
    : "rounded-[20px] bg-paper p-s7 text-ink shadow-sm";

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-s4">
        <div className="flex flex-col gap-1">
          <div
            className={[
              "text-[13px] font-medium",
              isPopular ? "text-paper/70" : "text-ink/70",
            ].join(" ")}
          >
            {isPopular ? <span>Recommended plan</span> : <span>Starting plan</span>}
          </div>
          <div className="text-[22px] font-semibold tracking-[-0.02em] text-inherit">
            {tier}
          </div>
        </div>
        {isPopular ? (
          <span className="rounded-full bg-violet px-4 py-2 text-[13px] font-semibold tracking-[-0.02em] text-ink">
            Most Popular
          </span>
        ) : null}
      </div>

      <div className="mt-s6 flex items-end gap-2">
        <div className="text-[44px] font-bold tracking-[-0.02em] text-inherit">
          {price}
        </div>
        <div className={isPopular ? "pb-2 text-paper/70" : "pb-2 text-ink/70"}>
          {cadence}
        </div>
      </div>

      <ul className="mt-s7 flex flex-col gap-s3">
        {features.map((feature, index) => (
          <li
            key={index}
            className={[
              "flex items-start gap-3 text-[16px] leading-[1.5]",
              isPopular ? "text-paper/82" : "text-ink/82",
            ].join(" ")}
          >
            <span className="text-violet">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-s8">
        <Button
          href="#availability"
          variant="primary"
          className={isPopular ? "ring-1 ring-paper/10" : ""}
        >
          Check Availability
        </Button>
      </div>
    </div>
  );
}
