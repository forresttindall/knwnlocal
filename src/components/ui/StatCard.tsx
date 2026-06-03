import * as React from "react";

export function StatCard({
  number,
  label,
  className,
}: {
  number: React.ReactNode;
  label: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      <div className="text-[#8d71d6] text-[64px] font-extrabold leading-none tracking-[-0.02em]">
        {number}
      </div>
      <div className="text-white text-[16px] font-normal leading-[1.5]">
        {label}
      </div>
    </div>
  );
}
