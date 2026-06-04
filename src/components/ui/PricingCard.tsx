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
    ? "rounded-lg bg-[#0d0b1a] p-s7 text-white shadow-pop ring-1 ring-[#8d71d6]"
    : "rounded-lg bg-white p-s7 text-black shadow-sm";

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-s4">
        <div className="flex flex-col gap-1">
          <div
            className={[
              "text-[13px] font-semibold uppercase tracking-[0.08em]",
              isPopular ? "text-white/70" : "text-black/70",
            ].join(" ")}
          >
            {isPopular ? (
              <span>Most Popular</span>
            ) : (
              <span>Tier</span>
            )}
          </div>
          <div className="text-[22px] font-semibold tracking-[-0.02em] text-inherit">
            {tier}
          </div>
        </div>
        {isPopular ? (
          <span className="rounded-full bg-[#8d71d6] px-4 py-2 text-[13px] font-semibold tracking-[-0.02em] text-white">
            Most Popular
          </span>
        ) : null}
      </div>

      <div className="mt-s6 flex items-end gap-2">
        <div className="text-[44px] font-bold tracking-[-0.02em] text-inherit">
          {price}
        </div>
        <div className={isPopular ? "pb-2 text-white/70" : "pb-2 text-black/70"}>
          {cadence}
        </div>
      </div>

      <ul className="mt-s7 flex flex-col gap-s3">
        {features.map((feature, index) => (
          <li
            key={index}
            className={isPopular ? "text-white/80" : "text-black/80"}
          >
            <span className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-[#8d71d6] align-middle" />
            <span className="align-middle text-[16px] leading-[1.5]">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-s8">
        <Button
          href="#availability"
          variant={isPopular ? "secondary" : "ghost"}
          className={isPopular ? "" : "border-ink"}
        >
          Check Availability
        </Button>
      </div>
    </div>
  );
}
