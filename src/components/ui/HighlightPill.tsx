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
  const base = "bg-violet text-paper inline whitespace-nowrap align-baseline";
  const shape =
    variant === "pill"
      ? "rounded-pill px-[14px] py-[2px]"
      : "rounded-block px-[10px] py-[2px]";

  return (
    <span className={[base, shape, className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
