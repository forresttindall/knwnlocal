import * as React from "react";

import { HighlightedText } from "./HighlightedText";
import { NameBadge } from "./NameBadge";

export function QuoteCard({
  quote,
  quoteField,
  variant = "light",
  firstName,
  lastName,
  className,
}: {
  quote: string;
  quoteField?: string;
  variant?: "light" | "dark";
  firstName: React.ReactNode;
  lastName: React.ReactNode;
  className?: string;
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={[
        "rounded-lg p-s7 shadow-sm",
        isDark ? "bg-[#1a1530] text-white" : "bg-[#ede9f8] text-black",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "text-[18px] leading-[1.45] tracking-[-0.01em]",
          isDark ? "text-white" : "text-black",
        ].join(" ")}
        data-editable={quoteField ? "true" : undefined}
        data-field={quoteField}
      >
        <HighlightedText text={quote} variant="pill" />
      </div>
      <div className="mt-s6 flex items-center justify-between gap-s4">
        <NameBadge firstName={firstName} lastName={lastName} />
        <div className="flex flex-col items-end">
          <div
            className={[
              "text-[14px] font-bold tracking-[-0.02em]",
              isDark ? "text-white" : "text-black",
            ].join(" ")}
          >
            <span className="font-bold">Knwn</span>
            <span className="font-normal">Local</span>
          </div>
          <div
            className={[
              "text-[13px] font-semibold uppercase tracking-[0.08em]",
              isDark ? "text-white/60" : "text-black/60",
            ].join(" ")}
          >
            KNWNLOCAL.COM
          </div>
        </div>
      </div>
    </div>
  );
}
