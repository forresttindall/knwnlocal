import * as React from "react";

import { HighlightedText } from "./HighlightedText";
import { NameBadge } from "./NameBadge";

export function QuoteCard({
  quote,
  quoteField,
  variant = "dark",
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
        "flex h-full flex-col rounded-[20px] p-s7",
        isDark
          ? "bg-ink text-paper shadow-md ring-1 ring-violet/25"
          : "bg-paper text-ink shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex-1 text-[18px] leading-[1.45] tracking-[-0.01em]",
          isDark ? "text-paper" : "text-ink",
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
              isDark ? "text-paper" : "text-ink",
            ].join(" ")}
          >
            <span className="font-bold">Knwn</span>
            <span className="font-normal">Local</span>
          </div>
          <div
            className={[
              "text-[13px] leading-none",
              isDark ? "text-paper/60" : "text-ink/60",
            ].join(" ")}
          >
            knwnlocal.com
          </div>
        </div>
      </div>
    </div>
  );
}
