"use client";

import * as React from "react";
import { ContactForm } from "@/components/sections/ContactForm";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { useEditMode } from "@/components/edit/EditModeProvider";
import { youtubeIdFromUrl } from "@/components/sections/Problem";

function attrs(editable: boolean, field: string) {
  if (!editable) return {};
  return { "data-editable": "true" as const, "data-field": field };
}

function isEditModeOn(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-edit-mode") === "true";
}

const DECK_SECTIONS = [
  {
    id: "demand",
    eyebrow: "Section 01",
    headline:
      "The demand is higher than the <highlight>supply</highlight>.",
    copy: "Most agent channels publish once every few months and stop at 30–300 views. Once a channel is planned, filmed, and published consistently to a single local market, the gap closes fast — and the first agent to publish on a topic keeps the traffic for years.",
    image1Field: "section-1-shot-agent-1",
    image1Caption: "Her last 2 videos without us",
    image1Stats: "51 views · 286 views",
    image2Field: "section-1-shot-agent-2",
    image2Caption: "Her first 2 videos with KnwnLocal",
    image2Stats: "37,000 views · 8,600 views",
  },
  {
    id: "attention",
    eyebrow: "Section 02",
    headline: "YouTube is the only platform that holds <highlight>people's attention</highlight>.",
    copy: "A short-form Reel or TikTok is usually skipped in under 8 seconds. A well-structured YouTube walkthrough, tour, or market breakdown keeps a viewer for minutes — our best clients average 8+ minutes of watch time per video. That's enough time to trust someone, not just scroll past them.",
    imageField: "section-2-shot",
  },
  {
    id: "intent",
    eyebrow: "Section 03",
    headline:
      "High-intent buyers and sellers find you via <highlight>Google, YouTube, and AI chat</highlight>.",
    copy: "When a serious buyer starts their search, they don't type your name. They type things into Google, ask YouTube, or prompt AI assistants. YouTube is the most-cited video platform in AI answers — and the answers that actually explain a market beat the listing-portal noise every time.",
    imageField: "section-3-shot",
  },
  {
    id: "bigscreen",
    eyebrow: "Section 04",
    headline:
      "YouTube videos are being watched on the <highlight>big screen</highlight>, not the small screen.",
    copy: "A huge slice of our viewership streams on TVs — couples, families, empty-nesters, people who don't use Instagram or TikTok at all. The buyer on their couch with a glass of wine watching a 12-minute neighborhood tour is the one writing the offer, not the scroller in the checkout line.",
    imageField: "section-4-shot",
  },
  {
    id: "authority",
    eyebrow: "Section 05",
    headline:
      "People get hooked and watch <highlight>hours</highlight> of your content before they reach out.",
    copy: "One video gets them in the door. Six videos later, they've watched a tour, a market report, a listing process walkthrough, and three client stories. By the time they email, you're already the expert they want to work with — not the 3rd agent they're cold-calling.",
    imageField: "section-5-shot",
  },
  {
    id: "quality",
    eyebrow: "Section 06",
    headline:
      "YouTube leads are the <highlight>highest-quality leads</highlight> in real estate.",
    copy: "Most internet leads are just looking for a house and will treat you like an order taker. YouTube leads are looking for help — they're looking for someone to explain a market, a process, or a neighborhood to them. We have clients who convert 1 in 6 of these leads into signed clients.",
    imageField: "section-6-shot",
  },
] as const;

type DeckSectionId = (typeof DECK_SECTIONS)[number]["id"];
type ActiveVideo = { youtubeId: string; name: string };

function ImageBlock({
  src,
  caption,
  stats,
  editable,
  field,
  invert = false,
}: {
  src: string;
  caption?: string;
  stats?: string;
  editable: boolean;
  field?: string;
  invert?: boolean;
}) {
  return (
    <figure
      className={[
        "flex flex-col overflow-hidden rounded-[20px] border",
        invert
          ? "border-paper/15 bg-black/30 text-paper"
          : "border-ink/15 bg-paper text-ink",
      ].join(" ")}
    >
      <div
        className={[
          "group relative w-full overflow-hidden",
          invert ? "bg-black/40" : "bg-ink/5",
        ].join(" ")}
        {...(field ? attrs(editable, field) : {})}
      >
        {src ? (
          <img
            alt={(caption ?? "Screenshot")}
            className="pointer-events-none h-auto w-full object-contain"
            src={src}
          />
        ) : (
          <div
            className={[
              "flex aspect-video w-full items-center justify-center text-[13px]",
              invert ? "text-paper/60" : "text-ink/55",
            ].join(" ")}
          >
            Drop screenshot here in edit mode
          </div>
        )}
        <span
          className={[
            "pointer-events-none absolute left-s3 top-s3 hidden rounded-full px-[10px] py-[4px] text-[11px] font-medium uppercase tracking-[0.14em] backdrop-blur-sm",
            invert
              ? "bg-black/55 text-paper"
              : "bg-black/55 text-paper",
            "[html[data-edit-mode='true']_&]:block",
          ].join(" ")}
        >
          Click to edit image
        </span>
      </div>
      <figcaption
        className={[
          "flex flex-col gap-[2px] px-s5 py-s4",
          invert ? "border-t border-paper/10" : "border-t border-ink/10",
        ].join(" ")}
      >
        {caption ? (
          <div className="text-[13px] font-semibold tracking-[-0.01em]">
            {caption}
          </div>
        ) : null}
        {stats ? (
          <div
            className={[
              "text-[13px]",
              invert ? "text-paper/65" : "text-ink/65",
            ].join(" ")}
          >
            {stats}
          </div>
        ) : null}
      </figcaption>
    </figure>
  );
}

function Testimonial({
  quote,
  attribution,
  role,
  headshotSrc,
  thumbSrc,
  videoUrl,
  editable,
  quoteField,
  nameField,
  roleField,
  imageField,
  thumbField,
  videoField,
  onOpenVideo,
}: {
  quote: string;
  attribution: string;
  role: string;
  headshotSrc: string;
  thumbSrc: string;
  videoUrl: string;
  editable: boolean;
  quoteField: string;
  nameField: string;
  roleField: string;
  imageField: string;
  thumbField: string;
  videoField: string;
  onOpenVideo?: (youtubeId: string) => void;
}) {
  const hasVideo = Boolean(videoUrl);
  const videoId = youtubeIdFromUrl(videoUrl);

  const handleThumbClick = (e: React.MouseEvent) => {
    if (isEditModeOn()) return;
    const id = youtubeIdFromUrl(videoUrl);
    if (id && onOpenVideo) {
      e.preventDefault();
      onOpenVideo(id);
    }
  };

  const handleLinkPillClick = (e: React.MouseEvent) => {
    if (isEditModeOn()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      const id = youtubeIdFromUrl(videoUrl);
      if (id && onOpenVideo) {
        e.preventDefault();
        onOpenVideo(id);
      }
    }
  };

  return (
    <section className="bg-paper">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[64px] md:px-[40px] md:py-[80px]">
        <div className="grid gap-[32px] md:grid-cols-[1fr_1.4fr] md:items-start md:gap-[40px] lg:gap-[56px]">
          <div className="flex flex-col items-start gap-[24px]">
            <div
              className={[
                "flex flex-row items-center gap-[20px]",
              ].join(" ")}
            >
              {headshotSrc ? (
                <img
                  alt={attribution}
                  className="h-[104px] w-[104px] shrink-0 rounded-full border-2 border-violet/70 object-cover shadow-md"
                  src={headshotSrc}
                  {...attrs(editable, imageField)}
                />
              ) : (
                <div
                  className="flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-violet/70 bg-violet/10 text-[13px] text-violet"
                  {...attrs(editable, imageField)}
                >
                  drop headshot
                </div>
              )}
            </div>
            <blockquote
              className="flex flex-col gap-s4"
              {...attrs(editable, quoteField)}
            >
              <div className="text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink md:text-[26px]">
                &ldquo;{quote}&rdquo;
              </div>
              <footer className="flex flex-col gap-[2px]">
                <div
                  className="text-[16px] font-bold tracking-[-0.01em] text-ink"
                  {...attrs(editable, nameField)}
                >
                  {attribution}
                </div>
                <div
                  className="text-[13px] text-ink/65"
                  {...attrs(editable, roleField)}
                >
                  {role}
                </div>
              </footer>
            </blockquote>
          </div>

          <div
            className={[
              "group relative block h-full w-full overflow-hidden rounded-[20px] bg-violet-soft shadow-sm transition-transform duration-200 ring-1 ring-ink/10",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={handleThumbClick}
              className="relative block h-full w-full p-0 text-left focus:outline-none focus:ring-4 focus:ring-violet/30 disabled:cursor-default"
              disabled={isEditModeOn()}
            >
              <div
                className="relative aspect-video w-full overflow-hidden"
                data-editable={editable ? "true" : undefined}
                data-field={thumbField}
              >
                {thumbSrc ? (
                  <img
                    src={thumbSrc}
                    alt={`${attribution} testimonial video thumbnail`}
                    className="pointer-events-none h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-ink/10 text-[13px] text-ink/55">
                    Drop video thumbnail in edit mode
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-ink/20 transition-colors duration-200 group-hover:bg-ink/30" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
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
                <span className="pointer-events-none absolute left-s3 top-s3 hidden rounded-full bg-black/55 px-[10px] py-[4px] text-[11px] font-medium uppercase tracking-[0.14em] text-paper backdrop-blur-sm [html[data-edit-mode='true']_&]:block">
                  Click thumbnail to edit image
                </span>
              </div>

              <div className="px-s6 py-s5">
                <div className="mt-s1 flex items-center justify-between gap-s3">
                  <div className="text-[14px] leading-[1.5] text-ink/70">
                    {hasVideo && videoId
                      ? `Watch ${attribution}'s story`
                      : "Paste video link in editor to enable playback"}
                  </div>
                  <span
                    className={[
                      "hidden shrink-0 items-center gap-s1 rounded-full border border-ink/15 bg-paper/60 px-[10px] py-[4px] text-[11px] font-medium text-ink/70 hover:border-violet hover:text-violet [html[data-edit-mode='true']_&]:inline-flex",
                    ].join(" ")}
                    data-editable={editable ? "true" : undefined}
                    data-field={videoField}
                    onClick={handleLinkPillClick}
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
        </div>
      </div>
    </section>
  );
}

function DeckSection({
  section,
  read,
  editable,
}: {
  section: (typeof DECK_SECTIONS)[number];
  read: (field: string) => string;
  editable: boolean;
}) {
  const isDark = section.id === "demand" || section.id === "attention" || section.id === "bigscreen" || section.id === "quality";

  const headline = section.headline;
  const headlineField = `section-${section.id}-headline`;
  const copyField = `section-${section.id}-copy`;

  const bg = isDark ? "bg-dark-radial text-paper" : "bg-cream text-ink";
  const copyClass = isDark ? "text-paper/70" : "text-ink/70";
  const headlineClass =
    "text-[32px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[48px]";

  return (
    <section className={bg}>
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px] md:py-[88px]">
        <div className="flex flex-col gap-[40px] md:gap-[48px]">
          <div className="flex flex-col gap-[24px] md:gap-[28px] md:max-w-[960px]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-violet">
              {section.eyebrow}
            </div>

            <h2 className={headlineClass} {...attrs(editable, headlineField)}>
              <HighlightedText
                text={read(headlineField) || headline}
                variant="pill"
              />
            </h2>

            <p
              className={`text-[18px] leading-[1.55] md:text-[20px] ${copyClass}`}
              {...attrs(editable, copyField)}
            >
              {read(copyField) || section.copy}
            </p>
          </div>

          {section.id === "demand" ? (
            <div className="grid gap-[24px] md:grid-cols-2 md:gap-[32px] lg:gap-[40px]">
              <ImageBlock
                src={read(section.image1Field)}
                caption={read("section-1-shot-1-caption") || section.image1Caption}
                stats={read("section-1-shot-1-stats") || section.image1Stats}
                editable={editable}
                field={section.image1Field}
                invert
              />
              <ImageBlock
                src={read(section.image2Field)}
                caption={read("section-1-shot-2-caption") || section.image2Caption}
                stats={read("section-1-shot-2-stats") || section.image2Stats}
                editable={editable}
                field={section.image2Field}
                invert
              />
              <div className="md:col-span-2">
                <p
                  className={`text-[13px] ${copyClass}`}
                  {...attrs(editable, "section-1-footnote")}
                >
                  {read("section-1-footnote") ||
                    "Same agent, same market, same camera. Planning + editing + publishing consistency is what changed."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-[24px] md:max-w-[1040px]">
              <ImageBlock
                src={read((section as any).imageField)}
                editable={editable}
                field={(section as any).imageField}
                invert={isDark}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function YouTubePlatformPage({
  fields,
  editable = false,
}: {
  fields: Record<string, string>;
  editable?: boolean;
}) {
  const { values } = useEditMode();
  const read = (f: string) => values[f] ?? fields[f] ?? "";

  const [activeVideo, setActiveVideo] = React.useState<ActiveVideo | null>(null);

  React.useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [activeVideo]);

  const openSally = (youtubeId: string) => {
    setActiveVideo({ youtubeId, name: read("testimonial-sally-name") || "Sally Daley" });
  };
  const openMicah = (youtubeId: string) => {
    setActiveVideo({ youtubeId, name: read("testimonial-micah-name") || "Micah Bleecher" });
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Nav editable={editable} ctaLabel={read("nav-cta") || undefined} />

      <main>
        {/* Hero */}
        <section className="bg-cream">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[32px] px-[24px] py-[72px] md:px-[40px] md:py-[88px]">
            <div
              className="text-[12px] font-semibold uppercase tracking-[0.3em] text-violet"
              {...attrs(editable, "hero-eyebrow")}
            >
              {read("hero-eyebrow")}
            </div>
            <h1
              className="max-w-[1000px] text-[40px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[64px]"
              {...attrs(editable, "hero-headline")}
            >
              <HighlightedText
                text={
                  read("hero-headline") ||
                  "A YouTube publishing platform for agents who want to be the <highlight>name</highlight> in their market."
                }
                variant="pill"
              />
            </h1>
            <p
              className="max-w-[820px] text-[18px] leading-[1.5] text-ink/80 md:text-[22px]"
              {...attrs(editable, "hero-subhead")}
            >
              {read("hero-subhead") ||
                "We plan, film, edit, publish, and report on your channel on a schedule. You show up once a week in front of a camera — we do the rest. No case studies, no portfolios, no creative lottery — just consistent weekly output in your market."}
            </p>
            <div className="flex flex-col items-start gap-[20px] sm:flex-row sm:items-center">
              <Button
                href="mailto:hello@knwnlocal.com?subject=KnwnLocal%20YouTube%20Platform"
                variant="primary"
                {...attrs(editable, "hero-cta-primary")}
              >
                {read("hero-cta-primary") || "Check availability"}
              </Button>
              <Button
                href="#section-demand"
                variant="secondary"
                {...attrs(editable, "hero-cta-secondary")}
              >
                {read("hero-cta-secondary") || "Read the 6 reasons"}
              </Button>
            </div>
          </div>
        </section>

        {/* §1 Demand > Supply */}
        <div id="section-demand">
          <DeckSection
            section={DECK_SECTIONS[0]}
            read={read}
            editable={editable}
          />
        </div>

        {/* Sally Daley testimonial */}
        <Testimonial
          quote={
            read("testimonial-sally-quote") ||
            "Within one month of publishing through KnwnLocal, our calendar was full of buyers we wouldn't have met any other way. No open houses. No paid leads. Just people watching our channel and picking up the phone."
          }
          attribution={read("testimonial-sally-name") || "Sally Daley"}
          role={read("testimonial-sally-role") || "Sally Daley Real Estate"}
          headshotSrc={read("testimonial-sally-headshot")}
          thumbSrc={read("testimonial-sally-thumb")}
          videoUrl={read("testimonial-sally-video")}
          editable={editable}
          quoteField="testimonial-sally-quote"
          nameField="testimonial-sally-name"
          roleField="testimonial-sally-role"
          imageField="testimonial-sally-headshot"
          thumbField="testimonial-sally-thumb"
          videoField="testimonial-sally-video"
          onOpenVideo={openSally}
        />

        {/* §2 Attention */}
        <DeckSection section={DECK_SECTIONS[1]} read={read} editable={editable} />
        {/* §3 High-intent search */}
        <DeckSection section={DECK_SECTIONS[2]} read={read} editable={editable} />
        {/* §4 Big screen */}
        <DeckSection section={DECK_SECTIONS[3]} read={read} editable={editable} />
        {/* §5 Hours watched authority */}
        <DeckSection section={DECK_SECTIONS[4]} read={read} editable={editable} />
        {/* §6 Highest quality leads */}
        <DeckSection section={DECK_SECTIONS[5]} read={read} editable={editable} />

        {/* Micah Bleecher testimonial */}
        <Testimonial
          quote={
            read("testimonial-micah-quote") ||
            "We used to buy every internet lead we could get. Now the first call of the week is someone who watched four of our videos over the weekend and already knows exactly which neighborhood they want. It's a different kind of lead."
          }
          attribution={read("testimonial-micah-name") || "Micah Bleecher"}
          role={read("testimonial-micah-role") || "Bleecher Group"}
          headshotSrc={read("testimonial-micah-headshot")}
          thumbSrc={read("testimonial-micah-thumb")}
          videoUrl={read("testimonial-micah-video")}
          editable={editable}
          quoteField="testimonial-micah-quote"
          nameField="testimonial-micah-name"
          roleField="testimonial-micah-role"
          imageField="testimonial-micah-headshot"
          thumbField="testimonial-micah-thumb"
          videoField="testimonial-micah-video"
          onOpenVideo={openMicah}
        />

        {/* Contact form */}
        <ContactForm
          headline={
            read("contact-headline") ||
            "Tell us about your <highlight>market</highlight>."
          }
          subhead={
            read("contact-subhead") ||
            "One short form. We'll reply with platform availability, scope, and next steps."
          }
        />
      </main>

      <Footer />

      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeVideo.name} video`}
          className="fixed inset-0 z-[100] flex items-center justify-center px-[16px] md:px-[24px]"
        >
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setActiveVideo(null)}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-[960px]">
            <button
              type="button"
              aria-label="Close video"
              onClick={() => setActiveVideo(null)}
              className="absolute -top-[48px] right-0 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-paper text-ink shadow-lg transition-transform hover:scale-105"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="overflow-hidden rounded-[20px] bg-ink shadow-pop">
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={`${activeVideo.name} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="mt-s4 text-center text-[16px] font-medium text-paper/90">
              {activeVideo.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
