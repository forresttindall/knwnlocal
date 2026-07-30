import { HighlightedText } from "@/components/ui/HighlightedText";

export type TestimonialVideo = {
  name: string;
  thumbnail: string;
  youtubeId: string;
};

export const testimonialVideos: TestimonialVideo[] = [
  {
    name: "Lindsey",
    thumbnail: "/images/Lindsey.webp",
    youtubeId: "9TBhz94UvrA",
  },
  {
    name: "Will",
    thumbnail: "/images/will.jpg",
    youtubeId: "-fEu9yylAsc",
  },
  {
    name: "Matt",
    thumbnail: "/images/matt.jpg",
    youtubeId: "dEmb-0zqAt4",
  },
];

export function Problem({
  headline,
  onOpenVideo,
}: {
  headline: string;
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
            {testimonialVideos.map((video) => (
              <button
                key={video.youtubeId}
                type="button"
                onClick={() => onOpenVideo(video.youtubeId)}
                className="group relative block h-full w-full overflow-hidden rounded-[20px] bg-violet-soft p-0 text-left shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet/30"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={`${video.name} testimonial video`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-ink/20 transition-colors duration-200 group-hover:bg-ink/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-violet shadow-pop transition-transform duration-200 group-hover:scale-110">
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
                </div>
                <div className="px-s6 py-s5">
                  <div className="text-[18px] font-semibold tracking-[-0.02em] text-ink">
                    {video.name}
                  </div>
                  <div className="mt-s1 text-[14px] leading-[1.5] text-ink/70">
                    Watch testimonial
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
