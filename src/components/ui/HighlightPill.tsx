import * as React from "react";

type HighlightVariant = "pill" | "block";

export function HighlightPill({
  children,
  variant = "pill",
  className,
}: {
  children: React.ReactNode;
  variant?: HighlightVariant;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap align-middle bg-[#8d71d6] text-white leading-none";
  const shape = "rounded-full px-[0.45em] py-[0.12em]";

  return (
    <span className={[base, shape, className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
