"use client";

import * as React from "react";
import { DeployBanner } from "@/components/edit/DeployBanner";
import { EditModeProvider, useEditMode } from "@/components/edit/EditModeProvider";
import { EditPopover } from "@/components/edit/EditPopover";
import { ContactForm } from "@/components/sections/ContactForm";
import { Finale } from "@/components/sections/Finale";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/sections/Nav";
import {
  Problem,
  type ProblemCard,
  youtubeIdFromUrl,
} from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import {
  SocialProof,
  type SocialCard,
} from "@/components/sections/SocialProof";
import { HighlightedText } from "@/components/ui/HighlightedText";

type ActiveVideo = { youtubeId: string; name: string };

const problemCardFields: Array<{ field: string; featured?: boolean }> = [
  { field: "problem-1" },
  { field: "problem-2", featured: true },
  { field: "problem-3" },
];

const socialCardFields: Array<{ field: string; featured?: boolean }> = [
  { field: "social-1" },
  { field: "social-2", featured: true },
  { field: "social-3" },
  { field: "social-4" },
  { field: "social-5", featured: true },
  { field: "social-6" },
];

function HomeContent({
  initialValues,
}: {
  initialValues: Record<string, string>;
}) {
  const { values } = useEditMode();
  const read = (field: string) => values[field] ?? initialValues[field] ?? "";

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

  const problemCards: ProblemCard[] = problemCardFields.map((c) => ({
    field: c.field,
    name: read(`${c.field}-name`),
    thumbSrc: read(`${c.field}-thumb`),
    videoUrl: read(`${c.field}-video`),
    featured: c.featured,
  }));

  const socialCards: SocialCard[] = socialCardFields.map((c) => ({
    field: c.field,
    thumbSrc: read(`${c.field}-thumb`),
    videoUrl: read(`${c.field}-video`),
    featured: c.featured,
  }));

  const openProblem = (youtubeId: string) => {
    const card = problemCards.find(
      (c) => youtubeIdFromUrl(c.videoUrl) === youtubeId,
    );
    setActiveVideo({ youtubeId, name: card?.name || "Testimonial" });
  };

  const openSocial = (youtubeId: string) => {
    setActiveVideo({ youtubeId, name: "Video" });
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Nav ctaLabel={read("nav-cta")} />

      <Hero
        eyebrow={read("hero-eyebrow")}
        headline={read("hero-headline")}
        subhead={read("hero-subhead")}
        primaryCta={read("hero-cta-primary")}
        secondaryCta={read("hero-cta-secondary")}
        trustText={read("hero-trust")}
        stats={[
          {
            field: "hero-stat-1",
            number: read("hero-stat-1-number"),
            label: read("hero-stat-1-label"),
          },
          {
            field: "hero-stat-2",
            number: read("hero-stat-2-number"),
            label: read("hero-stat-2-label"),
          },
          {
            field: "hero-stat-3",
            number: read("hero-stat-3-number"),
            label: read("hero-stat-3-label"),
          },
          {
            field: "hero-stat-4",
            number: read("hero-stat-4-number"),
            label: read("hero-stat-4-label"),
          },
        ]}
      />

      <Problem
        headline={read("problem-headline")}
        cards={problemCards}
        onOpenVideo={openProblem}
      />

      <Process
        headline={read("process-headline")}
        steps={[
          { field: "process-1", title: read("process-1-title") },
          { field: "process-2", title: read("process-2-title") },
          { field: "process-3", title: read("process-3-title") },
          { field: "process-4", title: read("process-4-title") },
          { field: "process-5", title: read("process-5-title") },
        ]}
      />

      <SocialProof
        headline={read("social-headline")}
        cards={socialCards}
        onOpenVideo={openSocial}
      />

      <ContactForm
        headline={read("contact-headline")}
        subhead={read("contact-subhead")}
      />

      <Finale />

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

export function HomePageClient({
  enabled,
  initialValues,
}: {
  enabled: boolean;
  initialValues: Record<string, string>;
}) {
  return (
    <EditModeProvider enabled={enabled} initialValues={initialValues} pageKey="home">
      <DeployBanner />
      <HomeContent initialValues={initialValues} />
      <EditPopover />
    </EditModeProvider>
  );
}
