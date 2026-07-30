"use client";

import * as React from "react";

type LogoDef = {
  name: string;
  render: React.ReactNode;
};

const logos: LogoDef[] = [
  {
    name: "New York University",
    render: (
      <svg
        viewBox="0 0 460 40"
        className="h-full w-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="New York University"
      >
        <g fill="currentColor">
          <path d="M34 8 L62 8 L62 34 L34 34 Z" />
          <path d="M8 28 C8 10 22 6 48 6 L62 6 L62 34 L48 34 C22 34 8 30 8 18 Z M20 28 C20 20 26 18 48 18 L49 18 L49 32 L48 32 C26 32 20 28 20 28 Z" />
          <text
            x="84"
            y="28"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="700"
            fontSize="18"
            letterSpacing="3"
          >
            NEW YORK UNIVERSITY
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "Johns Hopkins University",
    render: (
      <svg
        viewBox="0 0 460 40"
        className="h-full w-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Johns Hopkins University"
      >
        <g fill="none" stroke="currentColor">
          <circle cx="40" cy="20" r="15" fill="currentColor" fillOpacity="0.18" strokeWidth="1.1" />
          <path d="M40 8 L40 32 M30 11 L50 11 M30 29 L50 29 M26 16 L54 16 M26 24 L54 24" strokeWidth="1" />
        </g>
        <g fill="currentColor">
          <text
            x="80"
            y="18"
            fontFamily="Georgia, serif"
            fontWeight="700"
            fontSize="16"
            letterSpacing="1"
          >
            JOHNS HOPKINS
          </text>
          <text
            x="80"
            y="34"
            fontFamily="Georgia, serif"
            fontWeight="500"
            fontSize="10"
            letterSpacing="4"
          >
            UNIVERSITY
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "American Marketing Association",
    render: (
      <svg
        viewBox="0 0 460 40"
        className="h-full w-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="American Marketing Association"
      >
        <g fill="currentColor">
          <text
            x="0"
            y="32"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="300"
            fontSize="34"
            letterSpacing="3"
          >
            AMA
          </text>
        </g>
        <g stroke="currentColor" strokeWidth="1">
          <line x1="180" y1="6" x2="180" y2="34" />
        </g>
        <g fill="currentColor">
          <text
            x="192"
            y="20"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500"
            fontSize="11"
            letterSpacing="2"
          >
            AMERICAN MARKETING
          </text>
          <text
            x="192"
            y="34"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500"
            fontSize="11"
            letterSpacing="2"
          >
            ASSOCIATION
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "Forbes",
    render: (
      <svg
        viewBox="0 0 460 40"
        className="h-full w-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Forbes"
      >
        <g fill="currentColor">
          <text
            x="0"
            y="32"
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="900"
            fontSize="36"
            letterSpacing="-0.5"
          >
            Forbes
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "Entrepreneur",
    render: (
      <svg
        viewBox="0 0 460 40"
        className="h-full w-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Entrepreneur"
      >
        <g fill="currentColor">
          <text
            x="0"
            y="32"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="800"
            fontSize="26"
            letterSpacing="-0.2"
          >
            Entrepreneur
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "Adweek",
    render: (
      <svg
        viewBox="0 0 460 40"
        className="h-full w-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Adweek"
      >
        <g fill="currentColor">
          <text
            x="0"
            y="32"
            fontFamily="Impact, 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="28"
            letterSpacing="3"
          >
            ADWEEK
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "Inc.",
    render: (
      <svg
        viewBox="0 0 460 40"
        className="h-full w-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Inc."
      >
        <g fill="currentColor">
          <text
            x="0"
            y="32"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="900"
            fontSize="34"
            letterSpacing="-1"
          >
            Inc.
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "USA Today",
    render: (
      <svg
        viewBox="0 0 460 40"
        className="h-full w-auto max-w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="USA Today"
      >
        <g fill="currentColor">
          <circle cx="18" cy="20" r="13" />
          <text
            x="42"
            y="28"
            fontFamily="Garamond, Georgia, serif"
            fontWeight="800"
            fontSize="18"
            letterSpacing="4"
          >
            USATODAY
            <tspan fontSize="12">.</tspan>
          </text>
        </g>
      </svg>
    ),
  },
];

export function Finale() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <section id="finale" className="bg-dark-radial text-paper">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px] md:py-[88px]">
        <div className="flex flex-col gap-[56px] md:gap-[72px]">
          <div className="overflow-hidden rounded-[20px] bg-ink ring-1 ring-white/10 shadow-pop">
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              {mounted ? (
                <iframe
                  src="https://www.youtube.com/embed/6fXK6lvEfK0"
                  title="KnwnLocal overview"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-[32px] md:gap-[40px]">
            <div className="text-center text-[11px] font-semibold uppercase tracking-[0.36em] text-white/55 md:text-[12px]">
              Our Founders Have Been Featured In
            </div>

            <div className="mx-auto w-full max-w-[960px]">
              <div className="grid grid-cols-3 grid-flow-row-dense gap-[28px] md:gap-[36px]">
                {logos.slice(0, 3).map((l) => (
                  <div
                    key={l.name}
                    className="flex h-[40px] w-full items-center justify-center text-violet/80 md:h-[44px]"
                  >
                    {l.render}
                  </div>
                ))}
                {logos.slice(3, 6).map((l) => (
                  <div
                    key={l.name}
                    className="flex h-[40px] w-full items-center justify-center text-violet/80 md:h-[44px]"
                  >
                    {l.render}
                  </div>
                ))}
                <div
                  key="slot-7"
                  className="col-start-1 col-end-2 row-start-3 flex h-[40px] w-full items-center justify-center text-violet/80 md:h-[44px]"
                >
                  {logos[6].render}
                </div>
                <div className="col-start-2 col-end-3 row-start-3" aria-hidden />
                <div
                  key="slot-8"
                  className="col-start-3 col-end-4 row-start-3 flex h-[40px] w-full items-center justify-center text-violet/80 md:h-[44px]"
                >
                  {logos[7].render}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
