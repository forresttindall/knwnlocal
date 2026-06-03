"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";

import { useEditMode } from "./EditModeProvider";

const brandContext =
  "KnwnLocal brand voice: plainspoken, direct, confident. No emoji. No exclamation marks in body. Numbers over adjectives. Realtor-focused content agency.";

export function EditPopover() {
  const { enabled, active, selected, setSelected, setValue } = useEditMode();

  const [instruction, setInstruction] = React.useState("");
  const [manualMode, setManualMode] = React.useState(false);
  const [manualValue, setManualValue] = React.useState("");
  const [preview, setPreview] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selected) return;
    setInstruction("");
    setManualMode(false);
    setManualValue(selected.current);
    setPreview("");
    setStreaming(false);
    setError(null);
  }, [selected]);

  const close = React.useCallback(() => setSelected(null), [setSelected]);

  const position = React.useMemo(() => {
    if (!selected) return null;
    const gap = 12;
    const maxWidth = 520;
    const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;
    const viewportHeight =
      typeof window === "undefined" ? 800 : window.innerHeight;

    const left = Math.min(
      Math.max(16, selected.rect.left),
      Math.max(16, viewportWidth - maxWidth - 16),
    );

    const placeBelow = selected.rect.top < viewportHeight / 2;
    const top = placeBelow
      ? selected.rect.top + selected.rect.height + gap
      : Math.max(16, selected.rect.top - gap - 260);

    return { top, left, width: Math.min(maxWidth, viewportWidth - 32) };
  }, [selected]);

  const onRewrite = React.useCallback(async () => {
    if (!selected) return;
    if (!instruction.trim()) {
      setError("Add an instruction first.");
      return;
    }

    setError(null);
    setStreaming(true);
    setPreview("");

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          field: selected.field,
          current: selected.current,
          instruction,
          context: brandContext,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Request failed.");
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("No response stream.");
        setStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        const chunk = decoder.decode(value, { stream: true });
        setPreview((prev) => prev + chunk);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setStreaming(false);
    }
  }, [instruction, selected]);

  const onAccept = React.useCallback(() => {
    if (!selected) return;
    const next = manualMode ? manualValue : preview || selected.current;
    setValue(selected.field, next);
    close();
  }, [close, manualMode, manualValue, preview, selected, setValue]);

  if (!enabled || !active || !selected || !position) return null;

  return (
    <div
      className="fixed z-50 rounded-lg bg-paper p-s6 shadow-lg"
      style={{ top: position.top, left: position.left, width: position.width }}
      role="dialog"
      aria-label="Edit content"
    >
      <div className="flex flex-col gap-s4">
        <div className="flex items-start justify-between gap-s4">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink/70">
              Field
            </div>
            <div className="text-[14px] font-medium text-ink">{selected.field}</div>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-pill border-[1.5px] border-ink/20 px-4 py-2 text-[14px] font-medium text-ink hover:bg-ink hover:text-paper transition-[background-color,color,transform] duration-[400ms] ease-out active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>

        <div className="rounded-md bg-cream p-s4">
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink/70">
            Current
          </div>
          <div className="mt-1 text-[14px] leading-relaxed text-ink">
            {selected.current}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink/70">
            Edit
          </div>
          <button
            type="button"
            className="rounded-pill border-[1.5px] border-ink/20 px-4 py-2 text-[14px] font-medium text-ink hover:bg-ink hover:text-paper transition-[background-color,color,transform] duration-[400ms] ease-out active:scale-[0.98]"
            onClick={() => setManualMode((v) => !v)}
          >
            {manualMode ? "AI rewrite" : "Edit manually"}
          </button>
        </div>

        {manualMode ? (
          <textarea
            className="min-h-[120px] w-full resize-none rounded-md border border-ink/15 bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink outline-none focus:border-violet"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
          />
        ) : (
          <>
            <textarea
              className="min-h-[96px] w-full resize-none rounded-md border border-ink/15 bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink outline-none focus:border-violet"
              placeholder="What should this say?"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />

            <div className="rounded-md bg-lavender p-s4">
              <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink/70">
                Preview
              </div>
              <div className="mt-1 min-h-[44px] text-[14px] leading-relaxed text-ink">
                {preview ? preview : streaming ? "Streaming…" : "—"}
              </div>
            </div>
          </>
        )}

        {error ? <div className="text-[14px] text-ink">{error}</div> : null}

        <div className="flex flex-col gap-s3 sm:flex-row sm:items-center sm:justify-between">
          {!manualMode ? (
            <Button
              variant="primary"
              type="button"
              onClick={onRewrite}
              disabled={streaming}
              className={streaming ? "opacity-70" : ""}
            >
              Rewrite with AI
            </Button>
          ) : null}

          <div className="flex items-center gap-s3">
            <Button variant="ghost" type="button" onClick={close}>
              Reject
            </Button>
            <Button variant="secondary" type="button" onClick={onAccept}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
