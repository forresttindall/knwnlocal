const logoFiles = [
  "/images/logos/16.webp",
  "/images/logos/17.webp",
  "/images/logos/18.webp",
  "/images/logos/19.webp",
  "/images/logos/20.webp",
  "/images/logos/21.webp",
  "/images/logos/22.webp",
  "/images/logos/23.webp",
  "/images/logos/24.webp",
  "/images/logos/25.webp",
  "/images/logos/26.webp",
  "/images/logos/27.webp",
  "/images/logos/28.webp",
  "/images/logos/29.webp",
  "/images/logos/30.webp",
];

export function LogoTicker() {
  const track = [...logoFiles, ...logoFiles];

  return (
    <div className="w-full overflow-hidden">
      <style>{`
        @keyframes logoTicker {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
      <div
        className="flex w-max items-center gap-[40px] md:gap-[56px]"
        style={{ animation: "logoTicker 45s linear infinite" }}
      >
        {track.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="flex h-[56px] w-auto shrink-0 items-center justify-center md:h-[72px]"
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="h-full w-auto object-contain opacity-80 grayscale transition-opacity hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
