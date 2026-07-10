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

function HomeContent({
  initialValues,
}: {
  initialValues: Record<string, string>;
}) {
  const { values } = useEditMode();

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Nav ctaLabel={values["nav-cta"] ?? initialValues["nav-cta"]} />

      <Hero
        eyebrow={values["hero-eyebrow"] ?? initialValues["hero-eyebrow"]}
        headline={values["hero-headline"] ?? initialValues["hero-headline"]}
        subhead={values["hero-subhead"] ?? initialValues["hero-subhead"]}
        primaryCta={values["hero-cta-primary"] ?? initialValues["hero-cta-primary"]}
        secondaryCta={values["hero-cta-secondary"] ?? initialValues["hero-cta-secondary"]}
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
                text={values["availability-headline"] ?? initialValues["availability-headline"]}
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
              <Button
                href="mailto:hello@knwnlocal.com"
                variant="primary"
                data-editable="true"
                data-field="availability-cta-primary"
              >
                {values["availability-cta-primary"] ?? initialValues["availability-cta-primary"]}
              </Button>
              <Button
                href="#pricing"
                variant="secondary"
                data-editable="true"
                data-field="availability-cta-secondary"
              >
                {values["availability-cta-secondary"] ?? initialValues["availability-cta-secondary"]}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
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
      <EditModeToggle />
    </EditModeProvider>
  );
}
