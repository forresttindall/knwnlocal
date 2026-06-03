export function ProcessStep({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-dashed border-violet text-center text-[14px] font-bold tracking-[-0.02em] text-paper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title}
    </div>
  );
}
