"use client";

import * as React from "react";
import { ContactForm } from "@/components/sections/ContactForm";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { useEditMode } from "@/components/edit/EditModeProvider";

function attrs(editable: boolean, field: string) {
  if (!editable) return {};
  return { "data-editable": "true" as const, "data-field": field };
}

const DECK_SECTIONS = [
  {
    id: "01",
    eyebrow: "Section 01",
    headline:
      "The data backs it up. Email is the <highlight>most effective channel</highlight> you have.",
    copy: "Every independent channel ranking says the same thing: email outperforms social, paid, mailers, and sign calls for lead quality, conversion, and listings. It is the #1 ROI channel in digital marketing and the #1 ROI channel in B2C. Social media posts get skipped in 8 seconds or less. An email lands in an inbox someone already checks, opened by someone who already knows your name.",
    image1Field: "section-01-shot-1",
    image1CaptionField: "section-01-caption-1",
    image1Caption: "Email vs. social — conversion rate comparison",
    image1StatsField: "section-01-stats-1",
    image1Stats: "3× better or more — every category",
    image2Field: "section-01-shot-2",
    image2CaptionField: "section-01-caption-2",
    image2Caption: "Best channels for lead quality — ranked",
    image2StatsField: "section-01-stats-2",
    image2Stats: "Email 40.8% · Open houses 30.3% · Website 30.1%",
  },
  {
    id: "02",
    eyebrow: "Section 02",
    headline:
      "Email newsletters have <highlight>mass appeal</highlight>. Listings and market reports don't.",
    copy: "A listing-only email gets opened by 3 people: the seller, their spouse, and their mom. A newsletter that covers restaurants, events, school districts, market movement, and a strong local point of view gets opened by everyone in your database — past clients, sphere, friends, family, leads old and new, buyers, sellers, renters, investors, and vendors. The bigger the audience that looks forward to hearing from you, the more conversations you get to have.",
    imageField: "section-02-shot",
  },
  {
    id: "03",
    eyebrow: "Section 03",
    headline: "Newsletters touch the <highlight>entire marketing funnel</highlight>.",
    copy: "Top of funnel you send local events, restaurants, and news — the kind of thing people forward to their spouse. Middle of funnel you send listings, market stats, and tie-ins to your YouTube content. Bottom of funnel you send reviews, home value updates, and listings that actually match someone's stated criteria. One channel does the work of three. And every issue reinforces the same thing: you are the local expert they already know.",
    imageField: "section-03-shot",
  },
  {
    id: "04",
    eyebrow: "Section 04",
    headline:
      "You own your list. No algorithm. No <highlight>Zillow-proof</highlight> surprises.",
    copy: "A social media account can get throttled, shadow-banned, or made obsolete by a product update. A portal lead goes to four agents at once and you never hear from them again. An email list is a direct, owned asset full of people who already know, like, and trust you enough to give you their inbox. It is the only channel in real estate that compounds forever — you don't have to re-earn the right to speak to your audience every week.",
    imageField: "section-04-shot",
  },
  {
    id: "05",
    eyebrow: "Section 05",
    headline:
      "Emails start <highlight>conversations</highlight>. Conversations create customers.",
    copy: "A listing portal sends people to a form. A good email sends people to reply. Reply threads turn into phone calls, coffee meetings, listing appointments, and referrals. The real value of an email list is not the open rate — it's the number of people who feel like they know you well enough to type back, \"Hey, I've been thinking about selling.\"",
  },
] as const;

type DeckSectionId = (typeof DECK_SECTIONS)[number]["id"];

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
            "pointer-events-none absolute left-s3 top-s3 hidden rounded-full px-[10px] py-[4px] text-[11px] font-medium uppercase tracking-[0.14em] text-paper backdrop-blur-sm",
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
  editable,
  quoteField,
  nameField,
  roleField,
  imageField,
}: {
  quote: string;
  attribution: string;
  role: string;
  headshotSrc: string;
  editable: boolean;
  quoteField: string;
  nameField: string;
  roleField: string;
  imageField: string;
}) {
  return (
    <section className="bg-paper">
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[64px] md:px-[40px] md:py-[80px]">
        <div className="grid gap-[32px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start md:gap-[40px] lg:gap-[56px]">
          <div className="flex flex-col items-start gap-[24px]">
            <div className="flex flex-row items-center gap-[20px]">
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
                <HighlightedText text={`"${quote}"`} variant="pill" />
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

          <div className="rounded-[20px] border border-ink/10 bg-dark-radial p-[24px] md:p-[28px]">
            <div className="flex flex-col gap-[16px] text-paper">
              <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-violet/85">
                From send → reply
              </div>
              <div className="grid grid-cols-3 items-center gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <div className="text-[18px] font-bold tracking-[-0.01em] text-paper md:text-[20px]">
                    2:06 PM
                  </div>
                  <div className="text-[11px] leading-[1.35] text-paper/60">
                    Send time
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-violet/80">
                    →
                  </div>
                  <div className="text-[11px] leading-[1.35] text-paper/60">
                    58 minutes
                  </div>
                </div>
                <div className="flex flex-col items-end gap-[4px]">
                  <div className="text-[18px] font-bold tracking-[-0.01em] text-paper md:text-[20px]">
                    5 replies
                  </div>
                  <div className="text-[11px] leading-[1.35] text-paper/60 text-right">
                    2 listings · 1 home value
                  </div>
                </div>
              </div>
              <p className="text-[14px] leading-[1.55] text-paper/70">
                That's a normal Tuesday. People reply to emails because it feels like you — not a portal form, not a lead router, not an algorithm deciding whether they should see your name.
              </p>
            </div>
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
  const isDark =
    section.id === "01" || section.id === "03" || section.id === "05";

  const headlineField = `section-${section.id}-headline`;
  const eyebrowField = `section-${section.id}-eyebrow`;
  const copyField = `section-${section.id}-copy`;

  const bg = isDark ? "bg-dark-radial text-paper" : "bg-cream text-ink";
  const copyClass = isDark ? "text-paper/70" : "text-ink/70";
  const headlineClass =
    "text-[32px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[48px]";

  return (
    <section id={`section-${section.id}`} className={bg}>
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px] md:px-[40px] md:py-[88px]">
        <div className="flex flex-col gap-[40px] md:gap-[48px]">
          <div className="flex flex-col gap-[24px] md:gap-[28px] md:max-w-[960px]">
            <div
              className="text-[12px] font-semibold uppercase tracking-[0.28em] text-violet"
              {...attrs(editable, eyebrowField)}
            >
              {read(eyebrowField) || section.eyebrow}
            </div>

            <h2 className={headlineClass} {...attrs(editable, headlineField)}>
              <HighlightedText
                text={read(headlineField) || section.headline}
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

          {section.id === "01" ? (
            <div className="grid gap-[24px] md:grid-cols-2 md:gap-[32px] lg:gap-[40px]">
              <ImageBlock
                src={read((section as any).image1Field)}
                caption={
                  read((section as any).image1CaptionField) ||
                  (section as any).image1Caption
                }
                stats={
                  read((section as any).image1StatsField) ||
                  (section as any).image1Stats
                }
                editable={editable}
                field={(section as any).image1Field}
                invert
              />
              <ImageBlock
                src={read((section as any).image2Field)}
                caption={
                  read((section as any).image2CaptionField) ||
                  (section as any).image2Caption
                }
                stats={
                  read((section as any).image2StatsField) ||
                  (section as any).image2Stats
                }
                editable={editable}
                field={(section as any).image2Field}
                invert
              />
            </div>
          ) : (section as any).imageField ? (
            <div className="grid gap-[24px] md:max-w-[1040px]">
              <ImageBlock
                src={read((section as any).imageField)}
                editable={editable}
                field={(section as any).imageField}
                invert={isDark}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function EmailPlatformPage({
  fields,
  editable = false,
}: {
  fields: Record<string, string>;
  editable?: boolean;
}) {
  const { values } = useEditMode();
  const read = (f: string) => values[f] ?? fields[f] ?? "";

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
                text={read("hero-headline")}
                variant="pill"
              />
            </h1>
            <p
              className="max-w-[820px] text-[18px] leading-[1.5] text-ink/80 md:text-[22px]"
              {...attrs(editable, "hero-subhead")}
            >
              {read("hero-subhead")}
            </p>
            <div className="flex flex-col items-start gap-[20px] sm:flex-row sm:items-center">
              <Button
                href="/#contact"
                variant="primary"
                {...attrs(editable, "hero-cta-primary")}
              >
                {read("hero-cta-primary") || "Check availability"}
              </Button>
              <Button
                href="#section-01"
                variant="secondary"
                {...attrs(editable, "hero-cta-secondary")}
              >
                {read("hero-cta-secondary") || "Read the 5 reasons"}
              </Button>
            </div>
            <div className="mt-[8px] grid grid-cols-3 gap-[20px] pt-[16px] md:gap-[48px]">
              {[
                { n: "hero-stat-1-number", l: "hero-stat-1-label" },
                { n: "hero-stat-2-number", l: "hero-stat-2-label" },
                { n: "hero-stat-3-number", l: "hero-stat-3-label" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-[6px]">
                  <div
                    className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]"
                    {...attrs(editable, s.n)}
                  >
                    {read(s.n)}
                  </div>
                  <div
                    className="max-w-[26ch] text-[12px] leading-[1.35] text-ink/60 md:text-[13px]"
                    {...attrs(editable, s.l)}
                  >
                    {read(s.l)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DeckSection
          section={DECK_SECTIONS[0]}
          read={read}
          editable={editable}
        />
        <DeckSection
          section={DECK_SECTIONS[1]}
          read={read}
          editable={editable}
        />
        <DeckSection
          section={DECK_SECTIONS[2]}
          read={read}
          editable={editable}
        />
        <DeckSection
          section={DECK_SECTIONS[3]}
          read={read}
          editable={editable}
        />
        <DeckSection
          section={DECK_SECTIONS[4]}
          read={read}
          editable={editable}
        />

        <Testimonial
          quote={read("testimonial-glennda-quote")}
          attribution={read("testimonial-glennda-name") || "Glennda Baker"}
          role={
            read("testimonial-glennda-role") ||
            "Real Estate Agent · Atlanta, GA"
          }
          headshotSrc={read("testimonial-glennda-headshot")}
          editable={editable}
          quoteField="testimonial-glennda-quote"
          nameField="testimonial-glennda-name"
          roleField="testimonial-glennda-role"
          imageField="testimonial-glennda-headshot"
        />

        <ContactForm
          headline={read("contact-headline")}
          subhead={read("contact-subhead")}
        />
      </main>

      <Footer />
    </div>
  );
}
