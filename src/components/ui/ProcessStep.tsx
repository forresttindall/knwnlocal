export function ProcessStep({
  title,
  stepNumber,
  className,
}: {
  title: string;
  stepNumber: number;
  className?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-[8px] text-center">
      <div
        className={[
          "flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-violet bg-transparent text-[12px] font-semibold leading-none tracking-[-0.02em] text-paper sm:h-[44px] sm:w-[44px] sm:text-[13px] md:h-[128px] md:w-[128px] md:px-4 md:text-[16px]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="md:hidden">{stepNumber}</span>
        <span className="hidden md:block">{title}</span>
      </div>
      <div className="min-w-0 text-[9px] font-semibold leading-[1.1] tracking-[-0.02em] text-paper sm:text-[10px] md:hidden">
        {title}
      </div>
    </div>
  );
}
