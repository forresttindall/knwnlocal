import * as React from "react";

export function NameBadge({
  firstName,
  lastName,
  className,
}: {
  firstName: React.ReactNode;
  lastName: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[14px] tracking-[-0.02em] text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="font-normal">{firstName}</span>
      <span className="font-bold">{lastName}</span>
    </div>
  );
}
