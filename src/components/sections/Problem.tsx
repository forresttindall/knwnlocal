"use client";

import { HighlightedText } from "@/components/ui/HighlightedText";

export type ProblemCard = {
  field: string;
  name: string;
  thumbSrc: string;
  videoUrl: string;
  featured?: boolean;
};

export function youtubeIdFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace(/^\//, "") || null;
    }
    const v = u.searchParams.get("v");
    if (v) return v;
    const m = u.pathname.match(/\/(embed|shorts|v)\/([A-Za-z0-9_-]{6,})/);
    if (m) return m[2];
  } catch {
    if (/^[A-Za-z0-9_-]{8,}$/.test(url.trim())) return url.trim();
  }
  return null;
}

export function Problem({
  headline,
  cards,
  onOpenVideo,
}: {
  headline: string;
  cards: ProblemCard[];
  onOpenVideo: (youtubeId: string) => void;
}) {
  return (
    <section id="problem" className="bg-cream text-ink">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
        <div className="flex flex-col gap-[56px]">
          <h2
            className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
            data-editable="true"
            data-field="problem-headline"
          >
            <HighlightedText text={headline} variant="pill" />
          </h2>

          <div className="grid gap-[32px] md:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.field}
                className={[
                  "group relative block h-full w-full overflow-hidden rounded-[20px] bg-violet-soft p-0 text-left shadow-sm transition-transform duration-200",
                  card.featured
                    ? "ring-2 ring-violet shadow-[0_22px_60px_-30px_rgba(157,78,221,0.55)]"
                    : "ring-1 ring-ink/10",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => {
                    const id = youtubeIdFromUrl(card.videoUrl);
                    if (id) onOpenVideo(id);
                  }}
                  className="relative block h-full w-full p-0 text-left focus:outline-none focus:ring-4 focus:ring-violet/30"
                >
                  <div
                    className="relative aspect-video w-full overflow-hidden"
                    data-editable="true"
                    data-field={`${card.field}-thumb`}
                  >
                    <img
                      src={card.thumbSrc}
                      alt={`${card.name} testimonial video`}
                      className="pointer-events-none h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-ink/20 transition-colors duration-200 group-hover:bg-ink/30" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-violet shadow-pop transition-transform duration-200 group-hover:scale-110 opacity-50">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-[2px] text-paper"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                        </svg>
                      </span>
                    </div>
                    <span className="pointer-events-none absolute left-s3 top-s3 hidden rounded-full bg-black/55 px-[10px] py-[4px] text-[11px] font-medium uppercase tracking-[0.14em] text-paper backdrop-blur-sm [html[data-edit-mode='true']_&]:block">
                      Click thumbnail to edit image
                    </span>
                  </div>

                  <div className="px-s6 py-s5">
                    <div
                      className="text-[18px] font-semibold tracking-[-0.02em] text-ink"
                      data-editable="true"
                      data-field={`${card.field}-name`}
                    >
                      {card.name}
                    </div>
                    <div className="mt-s1 flex items-center justify-between gap-s3">
                      <div className="text-[14px] leading-[1.5] text-ink/70">
                        Watch testimonial
                      </div>
                      <span
                        className="hidden shrink-0 items-center gap-s1 rounded-full border border-ink/15 bg-paper/60 px-[10px] py-[4px] text-[11px] font-medium text-ink/70 hover:border-violet hover:text-violet [html[data-edit-mode='true']_&]:inline-flex"
                        data-editable="true"
                        data-field={`${card.field}-video`}
                        onClick={(e) => {
                          if (
                            document.documentElement.getAttribute("data-edit-mode") ===
                            "true"
                          ) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Edit video link
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
