"use client";

import * as React from "react";

type LogoDef = {
  name: string;
  src: string;
};

const logos: LogoDef[] = [
  {
    name: "New York University",
    src: "/images/Icons/6223ae56bf2ccae4249f76d5_nyu_logo.svg",
  },
  {
    name: "Johns Hopkins University",
    src: "/images/Icons/6223ae7c399e1ccd328f9a4c_jpu_logo.svg",
  },
  {
    name: "American Marketing Association",
    src: "/images/Icons/6223af01d91be1c67ed9abf3_ama_logo.svg",
  },
  {
    name: "Forbes",
    src: "/images/Icons/6223ae3166d2c1b9efc9bde2_forbes.svg",
  },
  {
    name: "Entrepreneur",
    src: "/images/Icons/6223b096324d2c67f7df0207_entrepreneur_logo.svg",
  },
  {
    name: "Adweek",
    src: "/images/Icons/6223b0b86cb102e64a5d5714_adweek_logo.svg",
  },
  {
    name: "Inc.",
    src: "/images/Icons/6223b0f465cd9051f74bb498_inc_logo.svg",
  },
  {
    name: "USA Today",
    src: "/images/Icons/6223925aa2cbfa24b3e42fe4_Usa_today_logo.png",
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
                    className="flex h-[40px] w-full items-center justify-center md:h-[44px]"
                  >
                    <img
                      src={l.src}
                      alt={l.name}
                      className="h-full w-auto object-contain"
                      style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(550%) hue-rotate(220deg) brightness(100%) contrast(90%) opacity(85%)" }}
                    />
                  </div>
                ))}
                {logos.slice(3, 6).map((l) => (
                  <div
                    key={l.name}
                    className="flex h-[40px] w-full items-center justify-center md:h-[44px]"
                  >
                    <img
                      src={l.src}
                      alt={l.name}
                      className="h-full w-auto object-contain"
                      style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(550%) hue-rotate(220deg) brightness(100%) contrast(90%) opacity(85%)" }}
                    />
                  </div>
                ))}
                <div
                  key="slot-7"
                  className="col-start-1 col-end-2 row-start-3 flex h-[40px] w-full items-center justify-center md:h-[44px]"
                >
                  <img
                    src={logos[6].src}
                    alt={logos[6].name}
                    className="h-full w-auto object-contain"
                    style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(550%) hue-rotate(220deg) brightness(100%) contrast(90%) opacity(85%)" }}
                  />
                </div>
                <div className="col-start-2 col-end-3 row-start-3" aria-hidden />
                <div
                  key="slot-8"
                  className="col-start-3 col-end-4 row-start-3 flex h-[40px] w-full items-center justify-center md:h-[44px]"
                >
                  <img
                    src={logos[7].src}
                    alt={logos[7].name}
                    className="h-full w-auto object-contain"
                    style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(550%) hue-rotate(220deg) brightness(100%) contrast(90%) opacity(85%)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
