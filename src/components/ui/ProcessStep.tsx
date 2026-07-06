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
        "flex h-[128px] w-[128px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-violet bg-transparent px-4 text-center text-[16px] font-semibold tracking-[-0.02em] text-paper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title}
    </div>
  );
}
