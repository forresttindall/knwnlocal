"use client";

import { Pencil } from "lucide-react";

import { useEditMode } from "./EditModeProvider";

export function EditModeToggle() {
  const { enabled, active, setActive } = useEditMode();

  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={() => setActive(!active)}
      className="fixed bottom-s7 right-s7 z-50 flex items-center gap-2 rounded-pill bg-violet px-5 py-3 text-paper shadow-lg transition-[transform,background-color] duration-[400ms] ease-out hover:bg-violet-600 active:scale-[0.98]"
    >
      <Pencil aria-hidden size={18} strokeWidth={1.5} />
      <span className="text-[14px] font-semibold tracking-[-0.02em]">
        Edit Mode
      </span>
      <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-paper/70">
        <span className={active ? "h-2 w-2 rounded-full bg-paper" : ""} />
      </span>
    </button>
  );
}
