export type ProcessStepVariant = "default" | "accent" | "featured";

export function ProcessStep({
  title,
  stepNumber,
  variant = "default",
  className,
}: {
  title: string;
  stepNumber: number;
  variant?: ProcessStepVariant;
  className?: string;
}) {
  const variants: Record<ProcessStepVariant, string> = {
    default:
      "border-2 border-dashed border-violet bg-transparent text-paper",
    accent:
      "border-2 border-solid border-violet bg-ink text-paper shadow-sm",
    featured:
      "border-2 border-solid border-paper bg-violet text-paper shadow-pop",
  };

  return (
    <div className="flex min-w-0 flex-col items-center gap-[12px] text-center">
      <div
        className={[
          "flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full font-semibold leading-none tracking-[-0.02em] sm:h-[44px] sm:w-[44px] md:h-[88px] md:w-[88px]",
          variants[variant],
          variant === "featured"
            ? "text-[13px] sm:text-[14px] md:text-[20px]"
            : "text-[13px] sm:text-[14px] md:text-[18px]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span>{stepNumber}</span>
      </div>
      <div className="min-w-0 text-[11px] font-semibold leading-[1.15] tracking-[-0.02em] text-paper sm:text-[12px] md:text-[14px]">
        {title}
      </div>
    </div>
  );
}
