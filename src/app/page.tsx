"use client";

import { DeployBanner } from "@/components/edit/DeployBanner";
import { EditModeProvider, useEditMode } from "@/components/edit/EditModeProvider";
import { EditModeToggle } from "@/components/edit/EditModeToggle";
import { EditPopover } from "@/components/edit/EditPopover";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/sections/Nav";
import { Pricing } from "@/components/sections/Pricing";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { SocialProof } from "@/components/sections/SocialProof";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";

const initialValues: Record<string, string> = {
  "nav-cta": "Check Availability",
  "hero-eyebrow": "Be Found, Get Knwn",
  "hero-headline": "You're Great At Real Estate. We Make It <highlight>Knwn</highlight>.",
  "hero-subhead":
    "Build a hyper-local brand that makes you the only choice. Clients seek you out. Agents want to join you. Competitors wonder how you're everywhere at once.",
  "hero-cta-primary": "Check Availability",
  "hero-cta-secondary": "See Pricing",
  "hero-trust": "Trusted by agents who want to own their market and stay top of mind.",
  "hero-stat-1-number": "758M",
  "hero-stat-1-label": "People reached",
  "hero-stat-2-number": "$11M+",
  "hero-stat-2-label": "In 2025 GCI for clients",
  "hero-stat-3-number": "100+",
  "hero-stat-3-label": "YouTube + newsletters",
  "hero-stat-4-number": "35+",
  "hero-stat-4-label": "Hours saved / month",

  "problem-headline": "Most Agents Don’t Need More Leads. They Need <highlight>Consistency</highlight>.",
  "problem-1-title": "No repeatable system",
  "problem-1-body":
    "You post when you have time. Your audience forgets you fast.",
  "problem-2-title": "Content takes too long",
  "problem-2-body":
    "You can sell houses or you can edit. Most weeks you end up doing neither well.",
  "problem-3-title": "Good ideas die in drafts",
  "problem-3-body":
    "You know what to say. Scripts, thumbnails, and scheduling are the bottleneck.",

  "process-headline": "A Simple Five-Step <highlight>Flow</highlight>.",
  "process-1-title": "Research",
  "process-2-title": "Strategy Call",
  "process-3-title": "Scripts + Thumbnails",
  "process-4-title": "You Film",
  "process-5-title": "We Publish",

  "social-headline": "Proof In The <highlight>Numbers</highlight>.",
  "test-1-quote":
    "We booked <highlight>six new listings</highlight> from people who had been watching for months.",
  "test-1-first": "Avery",
  "test-1-last": "Morgan",
  "test-2-quote":
    "The weekly cadence kept my SOI engaged. I stopped chasing content and started closing.",
  "test-2-first": "Jordan",
  "test-2-last": "Reed",
  "test-3-quote":
    "I filmed once and got a month of posts. It freed up <highlight>35+ hours</highlight>.",
  "test-3-first": "Taylor",
  "test-3-last": "Nguyen",

  "pricing-headline": "Pricing Built For <highlight>Momentum</highlight>.",
  "price-1-tier": "Bi-Weekly",
  "price-1-price": "$850",
  "price-1-cadence": "/ mo",
  "price-1-feature-1": "2 YouTube videos / month",
  "price-1-feature-2": "2 newsletters / month",
  "price-1-feature-3": "Scripts + thumbnails included",
  "price-1-feature-4": "Publishing + distribution",
  "price-2-tier": "Weekly",
  "price-2-price": "$1,500",
  "price-2-cadence": "/ mo",
  "price-2-feature-1": "4 YouTube videos / month",
  "price-2-feature-2": "4 newsletters / month",
  "price-2-feature-3": "Research + topic calendar",
  "price-2-feature-4": "Publishing + distribution",

  "availability-headline":
    "Check Availability In <highlight>Two Minutes</highlight>.",
  "availability-body":
    "Tell us your market, your price point, and what you want to be Knwn for. We’ll reply with openings and next steps.",
};

function HomeContent() {
  const { values } = useEditMode();

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Nav ctaLabel={values["nav-cta"] ?? "Check Availability"} />

      <Hero
        eyebrow={values["hero-eyebrow"] ?? initialValues["hero-eyebrow"]}
        headline={values["hero-headline"] ?? initialValues["hero-headline"]}
        subhead={values["hero-subhead"] ?? initialValues["hero-subhead"]}
        primaryCta={values["hero-cta-primary"] ?? initialValues["hero-cta-primary"]}
        secondaryCta={
          values["hero-cta-secondary"] ?? initialValues["hero-cta-secondary"]
        }
        trustText={values["hero-trust"] ?? initialValues["hero-trust"]}
        stats={[
          {
            field: "hero-stat-1",
            number: values["hero-stat-1-number"] ?? initialValues["hero-stat-1-number"],
            label: values["hero-stat-1-label"] ?? initialValues["hero-stat-1-label"],
          },
          {
            field: "hero-stat-2",
            number: values["hero-stat-2-number"] ?? initialValues["hero-stat-2-number"],
            label: values["hero-stat-2-label"] ?? initialValues["hero-stat-2-label"],
          },
          {
            field: "hero-stat-3",
            number: values["hero-stat-3-number"] ?? initialValues["hero-stat-3-number"],
            label: values["hero-stat-3-label"] ?? initialValues["hero-stat-3-label"],
          },
          {
            field: "hero-stat-4",
            number: values["hero-stat-4-number"] ?? initialValues["hero-stat-4-number"],
            label: values["hero-stat-4-label"] ?? initialValues["hero-stat-4-label"],
          },
        ]}
      />

      <Problem
        headline={values["problem-headline"] ?? initialValues["problem-headline"]}
        items={[
          {
            field: "problem-1",
            title: values["problem-1-title"] ?? initialValues["problem-1-title"],
            body: values["problem-1-body"] ?? initialValues["problem-1-body"],
          },
          {
            field: "problem-2",
            title: values["problem-2-title"] ?? initialValues["problem-2-title"],
            body: values["problem-2-body"] ?? initialValues["problem-2-body"],
          },
          {
            field: "problem-3",
            title: values["problem-3-title"] ?? initialValues["problem-3-title"],
            body: values["problem-3-body"] ?? initialValues["problem-3-body"],
          },
        ]}
      />

      <Process
        headline={values["process-headline"] ?? initialValues["process-headline"]}
        steps={[
          { field: "process-1", title: values["process-1-title"] ?? initialValues["process-1-title"] },
          { field: "process-2", title: values["process-2-title"] ?? initialValues["process-2-title"] },
          { field: "process-3", title: values["process-3-title"] ?? initialValues["process-3-title"] },
          { field: "process-4", title: values["process-4-title"] ?? initialValues["process-4-title"] },
          { field: "process-5", title: values["process-5-title"] ?? initialValues["process-5-title"] },
        ]}
      />

      <SocialProof
        headline={values["social-headline"] ?? initialValues["social-headline"]}
        testimonials={[
          {
            field: "test-1",
            quote: values["test-1-quote"] ?? initialValues["test-1-quote"],
            firstName: values["test-1-first"] ?? initialValues["test-1-first"],
            lastName: values["test-1-last"] ?? initialValues["test-1-last"],
          },
          {
            field: "test-2",
            quote: values["test-2-quote"] ?? initialValues["test-2-quote"],
            firstName: values["test-2-first"] ?? initialValues["test-2-first"],
            lastName: values["test-2-last"] ?? initialValues["test-2-last"],
          },
          {
            field: "test-3",
            quote: values["test-3-quote"] ?? initialValues["test-3-quote"],
            firstName: values["test-3-first"] ?? initialValues["test-3-first"],
            lastName: values["test-3-last"] ?? initialValues["test-3-last"],
          },
        ]}
      />

      <Pricing
        headline={values["pricing-headline"] ?? initialValues["pricing-headline"]}
        tiers={[
          {
            field: "price-1",
            tier: values["price-1-tier"] ?? initialValues["price-1-tier"],
            price: values["price-1-price"] ?? initialValues["price-1-price"],
            cadence: values["price-1-cadence"] ?? initialValues["price-1-cadence"],
            features: [
              values["price-1-feature-1"] ?? initialValues["price-1-feature-1"],
              values["price-1-feature-2"] ?? initialValues["price-1-feature-2"],
              values["price-1-feature-3"] ?? initialValues["price-1-feature-3"],
              values["price-1-feature-4"] ?? initialValues["price-1-feature-4"],
            ],
          },
          {
            field: "price-2",
            tier: values["price-2-tier"] ?? initialValues["price-2-tier"],
            price: values["price-2-price"] ?? initialValues["price-2-price"],
            cadence: values["price-2-cadence"] ?? initialValues["price-2-cadence"],
            features: [
              values["price-2-feature-1"] ?? initialValues["price-2-feature-1"],
              values["price-2-feature-2"] ?? initialValues["price-2-feature-2"],
              values["price-2-feature-3"] ?? initialValues["price-2-feature-3"],
              values["price-2-feature-4"] ?? initialValues["price-2-feature-4"],
            ],
            isPopular: true,
          },
        ]}
      />

      <section id="availability" className="bg-dark-radial text-paper">
        <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px]">
          <div className="flex flex-col gap-[24px]">
            <h2
              className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]"
              data-editable="true"
              data-field="availability-headline"
            >
              <HighlightedText
                text={
                  values["availability-headline"] ??
                  initialValues["availability-headline"]
                }
                variant="pill"
              />
            </h2>
            <p
              className="max-w-[720px] text-[18px] leading-[1.45] text-white/80 md:text-[20px]"
              data-editable="true"
              data-field="availability-body"
            >
              {values["availability-body"] ?? initialValues["availability-body"]}
            </p>
            <div className="flex flex-col gap-[20px] sm:flex-row sm:items-center">
              <Button href="mailto:hello@knwnlocal.com" variant="primary">
                Email Us
              </Button>
              <Button
                href="#pricing"
                variant="secondary"
              >
                Review Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Home() {
  const enabled = process.env.NEXT_PUBLIC_EDIT_MODE_ENABLED === "true";

  return (
    <EditModeProvider enabled={enabled} initialValues={initialValues}>
      <DeployBanner />
      <HomeContent />
      <EditPopover />
      <EditModeToggle />
    </EditModeProvider>
  );
}
