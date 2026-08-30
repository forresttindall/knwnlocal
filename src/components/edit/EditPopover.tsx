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
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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

  React.useEffect(() => {
    if (!enabled || !active || !selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [enabled, active, selected, close]);

  const kind = selected ? detectFieldKind(selected.field) : "text";
  const isStructured = kind !== "text";

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

  const onUploadFile = React.useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : "";
        if (!dataUrl) {
          setError("Could not read image.");
          return;
        }
        setError(null);
        setManualValue(dataUrl);
        setPreview(dataUrl);
        setManualMode(true);
      };
      reader.onerror = () => {
        setError("Could not read image.");
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  if (!enabled || !active || !selected) return null;

  const ytId = kind === "video" ? youtubeVideoId(selected.current) : null;

  const kindLabel =
    kind === "image"
      ? "Image path"
      : kind === "video"
        ? "YouTube URL"
        : "Body copy";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-[16px] py-[24px] sm:px-[24px] sm:py-[32px]"
      role="dialog"
      aria-modal="true"
      aria-label="Edit content"
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-[540px] max-h-[calc(100vh-48px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto rounded-[16px] sm:rounded-[20px] bg-paper p-[20px] sm:p-[24px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
      >
      <div className="flex flex-col gap-[16px] sm:gap-[20px]">
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
          <div className="overflow-hidden rounded-[10px] sm:rounded-md border border-ink/10 bg-ink/5">
            <div className="relative flex flex-col sm:flex-row sm:items-stretch sm:gap-0">
              <div className="relative flex-1 border-b sm:border-b-0 sm:border-r border-ink/10 bg-black/40">
                {(() => {
                  const src = manualMode && manualValue ? manualValue : preview || selected.current;
                  return src ? (
                    <img
                      key={src.slice(0, 200)}
                      src={src}
                      alt=""
                      className="h-[180px] sm:h-[200px] w-full object-contain bg-black/20"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-[180px] sm:h-[200px] items-center justify-center px-s4 text-center text-[13px] leading-relaxed text-paper/55">
                      No image yet — upload one below.
                    </div>
                  );
                })()}
                {manualMode && manualValue && manualValue !== selected.current ? (
                  <span className="absolute left-s3 top-s3 rounded-full bg-violet px-[10px] py-[4px] text-[11px] font-semibold uppercase tracking-[0.16em] text-paper shadow-pop">
                    New upload
                  </span>
                ) : null}
              </div>
              <div className="flex w-full sm:w-[220px] shrink-0 flex-col gap-s3 p-s4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUploadFile(file);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                />
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload image
                </Button>
                <div className="flex-1 text-[12px] leading-relaxed text-ink/70">
                  Accepts JPG, PNG, WebP, GIF, SVG from your device. Uploaded files are stored as data URLs in the CMS draft.
                </div>
                <div className="text-[12px] leading-relaxed text-ink/70">
                  Or paste a path (e.g. <code>/images/photo.webp</code>) or a full HTTPS URL below.
                </div>
              </div>
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
    </div>
  );
}
