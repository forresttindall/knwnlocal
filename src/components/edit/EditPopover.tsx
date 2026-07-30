"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";

import { useEditMode } from "./EditModeProvider";

const brandContext =
  "KnwnLocal brand voice: plainspoken, direct, confident. No emoji. No exclamation marks in body. Numbers over adjectives. Realtor-focused content agency.";

type FieldKind = "text" | "image" | "video";

function detectFieldKind(field: string): FieldKind {
  if (
    /(^|[-_])(thumb|image|img|headshot|shot)($|[-_])/.test(field) ||
    field.endsWith("-thumb") ||
    field.endsWith("-image") ||
    field.endsWith("-img") ||
    field.endsWith("-headshot") ||
    field.endsWith("-shot")
  )
    return "image";
  if (field.endsWith("-video") || field.endsWith("-url") || field.endsWith("-href"))
    return "video";
  return "text";
}

function youtubeVideoId(value: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace(/^\//, "") || null;
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const match = url.pathname.match(/\/(embed|shorts|v)\/([A-Za-z0-9_-]{6,})/);
    if (match) return match[2];
  } catch {
    if (/^[A-Za-z0-9_-]{8,}$/.test(value.trim())) return value.trim();
  }
  return null;
}

export function EditPopover() {
  const { enabled, active, selected, setSelected, setValue, values } = useEditMode();

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

  const kind = selected ? detectFieldKind(selected.field) : "text";
  const isStructured = kind !== "text";

  const position = React.useMemo(() => {
    if (!selected) return null;
    const gap = 12;
    const maxWidth = 540;
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
      : Math.max(16, selected.rect.top - gap - (isStructured ? 380 : 260));

    return { top, left, width: Math.min(maxWidth, viewportWidth - 32) };
  }, [selected, isStructured]);

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
          currentContentObject: values,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Request failed.");
        setStreaming(false);
        return;
      }

      const payload = (await res.json().catch(() => null)) as
        | { value?: string }
        | null;

      if (typeof payload?.value !== "string") {
        setError("Invalid edit response.");
        setStreaming(false);
        return;
      }

      setPreview(payload.value);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setStreaming(false);
    }
  }, [instruction, selected, values]);

  const onAccept = React.useCallback(() => {
    if (!selected) return;
    const next = manualMode ? manualValue : preview || selected.current;
    setValue(selected.field, next);
    close();
  }, [close, manualMode, manualValue, preview, selected, setValue]);

  if (!enabled || !active || !selected || !position) return null;

  const ytId = kind === "video" ? youtubeVideoId(selected.current) : null;

  const kindLabel =
    kind === "image"
      ? "Image path"
      : kind === "video"
        ? "YouTube URL"
        : "Body copy";

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
            <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/55">
              {kindLabel}
            </div>
            <div className="mt-1 text-[14px] font-medium text-ink">{selected.field}</div>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-pill border-[1.5px] border-ink/20 px-4 py-2 text-[14px] font-medium text-ink hover:bg-ink hover:text-paper transition-[background-color,color,transform] duration-[400ms] ease-out active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>

        {kind === "image" ? (
          <div className="overflow-hidden rounded-md border border-ink/10 bg-ink/5">
            {selected.current ? (
              <img
                src={selected.current}
                alt=""
                className="h-[180px] w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <div className="px-s4 py-s3 text-[12px] leading-relaxed text-ink/70">
              Accepts a local path (e.g. <code>/images/photo.webp</code>) or a full HTTPS URL.
            </div>
          </div>
        ) : null}

        {kind === "video" ? (
          <div className="overflow-hidden rounded-md border border-ink/10 bg-ink/5">
            {ytId ? (
              <div
                className="relative w-full"
                style={{ aspectRatio: "16 / 9" }}
              >
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title="YouTube video preview"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex h-[140px] items-center justify-center px-s4 text-center text-[13px] leading-relaxed text-ink/60">
                Paste a YouTube link to preview playback here.<br />
                <span className="text-ink/45">
                  e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ
                </span>
              </div>
            )}
            <div className="border-t border-ink/10 px-s4 py-s3 text-[12px] leading-relaxed text-ink/70">
              Paste a full YouTube URL or a bare 11-character video ID.
            </div>
          </div>
        ) : null}

        <div className="rounded-md bg-cream p-s4">
          <div className="text-[13px] font-medium text-ink/70">
            Current
          </div>
          <div className="mt-1 break-all text-[13px] leading-relaxed text-ink">
            {selected.current || "—"}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[13px] font-medium text-ink/70">
            Edit
          </div>
          <button
            type="button"
            className="rounded-pill border-[1.5px] border-ink/20 px-4 py-2 text-[14px] font-medium text-ink hover:bg-ink hover:text-paper transition-[background-color,color,transform] duration-[400ms] ease-out active:scale-[0.98]"
            onClick={() => setManualMode((v) => !v)}
          >
            {manualMode ? (isStructured ? "AI mode" : "AI rewrite") : "Edit manually"}
          </button>
        </div>

        {manualMode ? (
          kind === "image" ? (
            <input
              type="text"
              className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink outline-none focus:border-violet"
              placeholder="/images/photo.webp  or  https://…/image.jpg"
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
            />
          ) : kind === "video" ? (
            <input
              type="text"
              className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink outline-none focus:border-violet"
              placeholder="https://www.youtube.com/watch?v=…  or  video ID"
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
            />
          ) : (
            <textarea
              className="min-h-[120px] w-full resize-none rounded-md border border-ink/15 bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink outline-none focus:border-violet"
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
            />
          )
        ) : (
          <>
            <textarea
              className={`min-h-[96px] w-full resize-none rounded-md border border-ink/15 bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink outline-none focus:border-violet ${
                isStructured ? "opacity-60" : ""
              }`}
              placeholder={
                isStructured
                  ? "(Optional) Tell the AI how to change this value…"
                  : "What should this say?"
              }
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />

            <div className="rounded-md bg-violet-soft p-s4">
              <div className="text-[13px] font-medium text-ink/70">
                Preview
              </div>
              <div className="mt-1 min-h-[44px] break-all text-[14px] leading-relaxed text-ink">
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
              {isStructured ? "AI Suggest" : "Rewrite with AI"}
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
