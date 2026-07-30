"use client";

import { HighlightedText } from "@/components/ui/HighlightedText";
import { youtubeIdFromUrl } from "@/components/sections/Problem";

export type SocialCard = {
  field: string;
  thumbSrc: string;
  videoUrl: string;
  featured?: boolean;
  alt?: string;
};

function PlayIcon() {
  return (
    <svg
      width="24"
      height="28"
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 1.5L22 14L2 26.5V1.5Z" fill="currentColor" />
    </svg>
  );
}

export function SocialProof({
  headline,
  cards,
  onOpenVideo,
}: {
  headline: string;
  cards: SocialCard[];
  onOpenVideo?: (youtubeId: string) => void;
}) {
  return (
    <section className="bg-dark-radial text-paper">
      <div className="mx-auto w-full max-w-[1280px] px-[24px] py-[72px] md:px-[40px] md:py-[88px]">
        <div className="flex flex-col gap-[56px]">
          <div className="max-w-[900px]">
            <h2
              className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-paper md:text-[56px]"
              data-editable="true"
              data-field="social-headline"
            >
              <HighlightedText text={headline} variant="pill" />
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 md:grid-cols-3 md:gap-[28px]">
            {cards.map((c) => {
              const yt = youtubeIdFromUrl(c.videoUrl);
              return (
                <div
                  key={c.field}
                  className={[
                    "group relative w-full overflow-hidden rounded-[12px] bg-ink ring-1 ring-white/10 transition-all duration-200",
                    c.featured
                      ? "md:-translate-y-[4px] md:scale-[1.02] ring-2 ring-violet shadow-[0_18px_50px_-20px_rgba(157,78,221,0.55)]"
                      : "hover:-translate-y-[2px] hover:ring-white/25 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.8)]",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    className="relative block w-full p-0 text-left focus:outline-none focus:ring-4 focus:ring-violet/30"
                    onClick={() => {
                      if (yt && onOpenVideo) onOpenVideo(yt);
                    }}
                  >
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <div
                        className="absolute inset-0"
                        data-editable="true"
                        data-field={`${c.field}-thumb`}
                      >
                        <img
                          src={c.thumbSrc}
                          alt={c.alt || "Client results thumbnail"}
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />

                      <span
                        aria-hidden="true"
                        className={[
                          "pointer-events-none absolute left-1/2 top-1/2 flex h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-200 md:h-[76px] md:w-[76px]",
                          c.featured
                            ? "bg-violet ring-2 ring-white/90 shadow-[0_14px_40px_-12px_rgba(157,78,221,0.7)]"
                            : "bg-black/60 ring-1 ring-white/30 backdrop-blur-sm group-hover:bg-violet group-hover:ring-white/80",
                        ].join(" ")}
                      >
                        <PlayIcon />
                      </span>

                      <span
                        className="absolute right-s3 top-s3 hidden items-center gap-s1 rounded-full border border-white/15 bg-black/50 px-[10px] py-[4px] text-[11px] font-medium text-paper/90 hover:border-violet hover:text-violet [html[data-edit-mode='true']_&]:inline-flex"
                        data-editable="true"
                        data-field={`${c.field}-video`}
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
                        Link
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
