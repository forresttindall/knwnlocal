"use client";

import * as React from "react";
import { ContactForm } from "@/components/sections/ContactForm";
import { EmailLeadForm } from "@/components/sections/EmailLeadForm";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { useEditMode } from "@/components/edit/EditModeProvider";
import Funnel from "@/components/ui/Funnel";

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
      <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[56px] md:px-[40px] md:py-[88px]">
        <div className="flex flex-col items-start gap-[24px] md:gap-[36px]">
          <div className="flex flex-row items-center gap-[16px] md:gap-[20px]">
            {headshotSrc ? (
              <img
                alt={attribution}
                className="h-[88px] w-[88px] shrink-0 rounded-full border-2 border-violet/70 object-cover shadow-md md:h-[140px] md:w-[140px]"
                src={headshotSrc}
                {...attrs(editable, imageField)}
              />
            ) : (
              <div
                className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-violet/70 bg-violet/10 text-[12px] text-violet md:h-[140px] md:w-[140px] md:text-[13px]"
                {...attrs(editable, imageField)}
              >
                drop headshot
              </div>
            )}
          </div>
          <blockquote
            className="flex w-full flex-col gap-s4"
            {...attrs(editable, quoteField)}
          >
            <div className="text-[20px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink md:text-[36px]">
              <HighlightedText text={`"${quote}"`} variant="pill" />
            </div>
            <footer className="mt-[4px] flex flex-col gap-[2px] md:mt-[10px]">
              <div
                className="text-[16px] font-bold tracking-[-0.01em] text-ink md:text-[22px]"
                {...attrs(editable, nameField)}
              >
                {attribution}
              </div>
              <div
                className="text-[13px] text-ink/65 md:text-[15px]"
                {...attrs(editable, roleField)}
              >
                {role}
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function ReplyInboxGraphic({ dark = false }: { dark?: boolean }) {
  const emailBody = [
    "Hi [first name],",
    "I know rates are high, and that makes buying a challenge.",
    "But if I had a house that checked off all your must-haves and the price was within your budget, would you want to make an offer?",
    "Sincerely,",
    "[Your Name]",
  ];

  const inboxRows: {
    from: string;
    time: string;
    preview: string;
  }[] = [
    {
      from: "Silvia Faltaous",
      time: "11:17",
      preview:
        "It would have to be an amazing deal for me to consider purchasing anything now with the ridiculous rates.",
    },
    {
      from: "Gino Garofalo",
      time: "11:13",
      preview:
        "I won't be in a position to know until my pre construction condo closes in January, and I can see the status of my finances.",
    },
    {
      from: "Franca",
      time: "11:04",
      preview:
        "I'm not quite ready to sell at this time but will DEFINITELY keep you in mind when I am.",
    },
    {
      from: "Patel Parth",
      time: "11:02",
      preview:
        "Please send me the listing. I will review and let you know. Sent from Yahoo Mail on Android",
    },
    {
      from: "Paul van Nes",
      time: "11:01",
      preview:
        "Honestly, not at this point. I'm happy where I live for now. Feel free to leave me on the list though — one day I'll be in the market again",
    },
    {
      from: "Donna Chang",
      time: "10:58",
      preview:
        "I was hoping that I would've sold my other place first. I am not in the position to purchase without selling one of the properties I own.",
    },
  ];

  const paperText = dark ? "text-paper" : "text-ink";
  const subText = dark ? "text-paper/55" : "text-ink/50";

  return (
    <div className="relative mx-auto w-full max-w-[1120px]">
      {/* Email compose window */}
      <div
        className={[
          "relative z-20 mx-auto w-[94%] max-w-[920px] overflow-hidden rounded-[20px] border shadow-[0_20px_60px_-24px_rgba(0,0,0,0.55)] md:rounded-[26px]",
          dark ? "border-white/10 bg-white text-[#1a1824]" : "border-ink/10 bg-white text-ink",
        ].join(" ")}
      >
        {/* traffic lights + top bar */}
        <div className="flex items-center gap-[6px] border-b border-black/8 px-[16px] py-[14px] md:gap-[8px] md:px-[22px] md:py-[18px]">
          <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#ff5f57] md:h-[12px] md:w-[12px]" />
          <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#ffbd2e] md:h-[12px] md:w-[12px]" />
          <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#28c940] md:h-[12px] md:w-[12px]" />
          <span className="ml-[8px] text-[11px] font-medium tracking-[-0.01em] text-[#1a1824]/45 md:ml-[12px] md:text-[13px]">
            new message
          </span>
        </div>

        <div className="flex flex-col gap-[14px] px-[20px] py-[24px] md:gap-[18px] md:px-[56px] md:py-[42px]">
          {/* Subject pill */}
          <div>
            <span className="inline-block rounded-full bg-gradient-to-r from-[#8c62e0] to-[#aa84f6] px-[16px] py-[8px] text-[15px] font-extrabold tracking-[-0.015em] text-white shadow-[0_10px_24px_-14px_rgba(115,65,210,0.75)] md:px-[24px] md:py-[12px] md:text-[30px]">
              Subject Line: Just out of curiosity…
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-[12px] md:gap-[18px]">
            {emailBody.map((line, i) => {
              const isGreet = i === 0;
              const isSignoff = i === emailBody.length - 2;
              const isName = i === emailBody.length - 1;
              let cls = "text-[15px] leading-[1.38] tracking-[-0.01em] text-[#1b1826] md:text-[26px]";
              if (isGreet) cls = cls + " font-semibold";
              if (isSignoff) cls = cls + " font-semibold mt-[4px]";
              if (isName) cls = "text-[16px] font-bold leading-[1.3] tracking-[-0.01em] text-[#1b1826] md:text-[28px]";
              return (
                <p key={i} className={cls}>
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inbox list (peeks out below compose window, bottom-left "KnwnLocal" watermark on dark) */}
      <div
        className={[
          "relative z-10 -mt-[16px] w-full overflow-hidden rounded-t-[10px] border-b-0 shadow-[0_14px_40px_-24px_rgba(0,0,0,0.5)] md:-mt-[24px] md:rounded-t-[14px]",
          dark ? "bg-white/98 text-[#1a1824]" : "bg-white text-ink",
        ].join(" ")}
      >
        {/* Inbox header row */}
        <div className="hidden items-center gap-[14px] border-b border-black/8 px-[22px] py-[12px] md:flex">
          <div className="flex items-center gap-[10px]">
            <input type="checkbox" readOnly className="h-[14px] w-[14px] accent-[#7b4cdc]" />
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none">
              <path d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62 7.19.62-5.46 4.73L18.18 21z" fill="#ffcd3a" stroke="#e6a600" strokeWidth="0.8" />
            </svg>
            <span className="h-[10px] w-[10px] rounded-full bg-[#ffb300]" />
          </div>
          <div className="flex-1 truncate text-[12px] font-semibold tracking-[-0.01em] text-[#1a1824]/70">
            Inbox — {inboxRows.length} replies to your newsletter
          </div>
        </div>

        <ul className="divide-y divide-black/8">
          {inboxRows.map((row, i) => (
            <li
              key={i}
              className={[
                "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-[8px] px-[14px] py-[12px] md:gap-[14px] md:px-[28px] md:py-[15px]",
                i === 0 ? "bg-[#f3eeff]" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-[8px] min-w-0 md:gap-[12px]">
                <div className="flex shrink-0 items-center gap-[6px] pt-[2px] md:gap-[10px]">
                  <input type="checkbox" readOnly className="h-[11px] w-[11px] accent-[#7b4cdc] md:h-[13px] md:w-[13px]" />
                  <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" fill="none" className="md:w-[13px] md:h-[13px]">
                    <path d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62 7.19.62-5.46 4.73L18.18 21z" fill="#ffcd3a" stroke="#e6a600" strokeWidth="0.8" />
                  </svg>
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#ffb300] md:h-[9px] md:w-[9px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-[6px] gap-y-[2px] md:gap-x-[8px]">
                    <span className="truncate text-[13px] font-bold tracking-[-0.01em] text-[#1a1824] md:text-[16px]">
                      {row.from}
                    </span>
                    <span className="truncate text-[11px] font-semibold text-[#7b4cdc] md:text-[14px]">
                      Re: Just out of curiosity…
                      <span aria-hidden="true" className="ml-[4px] md:ml-[6px] inline-block align-middle">
                        🙂
                      </span>
                    </span>
                  </div>
                  <p
                    className={[
                      "mt-[3px] truncate text-[11px] leading-[1.35] md:mt-[4px] md:text-[14px]",
                      "text-[#1a1824]/60",
                    ].join(" ")}
                  >
                    <span className="text-[#1a1824]/90">
                      Hi {row.from.split(" ")[0]},{" "}
                    </span>
                    {row.preview}
                  </p>
                </div>
              </div>

              <span className="pt-[2px] shrink-0 text-[10px] font-semibold tracking-[-0.01em] text-[#1a1824]/55 md:pt-[3px] md:text-[13px]">
                {row.time}
              </span>
            </li>
          ))}
        </ul>

        {/* Bottom-left "KnwnLocal" watermark in the slanted dark strip (matches ref).
            Dark strip + inbox bottom edge extend FULL container width — no row content gets clipped. */}
        {dark ? (
          <div className="pointer-events-none relative h-[56px] w-full bg-[#1b1638] md:h-[72px]">
            <div
              className="absolute -top-[1px] left-0 right-0 h-[50px] bg-inherit md:h-[64px]"
              style={{
                clipPath:
                  "polygon(0 100%, 100% 100%, 100% 2%, 97.2% 2%, 96% 100%, 0 100%)",
              }}
            />
            <span className="absolute bottom-[8px] left-[14px] z-10 text-[20px] font-black tracking-[-0.03em] text-white md:bottom-[10px] md:left-[18px] md:text-[34px]">
              KnwnLocal
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RentedPlatformsGraphic({ dark = false }: { dark?: boolean }) {
  const cards: {
    name: string;
    quote: [string, string];
    Icon: React.ComponentType<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties }>;
  }[] = [
    {
      name: "Instagram",
      quote: ["Shadowbanned.", "No warning."],
      Icon: require("react-icons/si").SiInstagram as any,
    },
    {
      name: "TikTok",
      quote: ["Could vanish", "overnight."],
      Icon: require("react-icons/si").SiTiktok as any,
    },
    {
      name: "Facebook",
      quote: ["Algorithm controls", "reach."],
      Icon: require("react-icons/si").SiFacebook as any,
    },
  ];

  const headlineClr = dark ? "text-[#121025]" : "text-[#1a1824]";
  const captionClr = dark ? "text-[#1b1738]" : "text-[#221a36]";
  const iconColor = dark ? "#1b1738" : "#26203b";
  const cardBorder = dark ? "rgba(26,22,60,0.35)" : "rgba(40,34,66,0.35)";

  return (
    <div className="relative mx-auto w-full max-w-[820px] px-[4px] py-[16px]">
      {/* Diagonal stripes background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[28px] overflow-hidden"
        style={{
          background:
            "repeating-linear-gradient(-30deg, rgba(255,255,255,0.26) 0 3px, rgba(255,255,255,0.56) 3px 6px)",
          backgroundColor: dark ? "rgba(255,255,255,0.12)" : "rgba(244,240,255,0.9)",
          backdropFilter: dark ? "blur(2px)" : undefined,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-[24px] px-[20px] py-[32px] md:gap-[40px] md:px-[60px] md:py-[56px]">
        {/* Top: RENTED PLATFORMS */}
        <h3
          className={[
            "text-[26px] font-black leading-[0.98] tracking-[-0.025em] md:text-[64px]",
            headlineClr,
          ].join(" ")}
        >
          RENTED PLATFORMS
        </h3>

        {/* Lock pill */}
        <div
          className="inline-flex items-center gap-[10px] rounded-full px-[22px] py-[10px] text-[18px] font-extrabold tracking-[-0.015em] text-white shadow-[0_12px_30px_-16px_rgba(0,0,0,0.5)] md:gap-[14px] md:px-[34px] md:py-[12px] md:text-[32px]"
          style={{
            background:
              "linear-gradient(180deg, #6a6877 0%, #444353 55%, #2f2e3e 100%)",
          }}
        >
          <svg width="22" height="24" viewBox="0 0 32 34" fill="none" aria-hidden="true" className="md:w-[28px] md:h-[30px]">
            <path
              d="M12.4 15.4V10.6a3.6 3.6 0 1 1 7.2 0v4.8"
              stroke="#dfe1ea"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="5.6" y="15" width="20.8" height="14.2" rx="3" fill="#dfe1ea" />
          </svg>
          RENTED
        </div>

        {/* Three cards */}
        <div className="flex w-full max-w-[640px] flex-col gap-[16px] md:gap-[24px]">
          {cards.map((card) => (
            <div
              key={card.name}
              className="relative flex items-start gap-[14px] rounded-[20px] border bg-white/95 px-[18px] py-[18px] shadow-[0_16px_40px_-24px_rgba(30,18,80,0.35)] md:gap-[28px] md:rounded-[26px] md:px-[30px] md:py-[28px]"
              style={{ borderColor: cardBorder }}
            >
              <card.Icon size={36} color={iconColor} aria-hidden="true" className="shrink-0 mt-[2px] md:mt-[4px] md:size-[54px]" />
              <div className="min-w-0 flex-1">
                <div className="text-[20px] font-black tracking-[-0.02em] text-[#1a1824] leading-[1.05] md:text-[34px]">
                  {card.name}
                </div>
                <div className="mt-[4px] text-[16px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#2a2346] md:text-[26px]">
                  <div className="whitespace-pre-wrap">
                    &ldquo;{card.quote[0]}
                  </div>
                  <div>{card.quote[1]}&rdquo;</div>
                </div>
              </div>

              {/* Dismiss X */}
              <button
                type="button"
                aria-label={`Dismiss ${card.name}`}
                className="pointer-events-none flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full md:h-[42px] md:w-[42px]"
                style={{
                  background:
                    "linear-gradient(180deg, #b7b6c1 0%, #8d8c98 100%)",
                }}
              >
                <svg viewBox="0 0 22 22" width="14" height="14" fill="none" aria-hidden="true" className="md:w-[18px] md:h-[18px]">
                  <path
                    d="M5 5 L17 17 M17 5 L5 17"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Caption */}
        <p
          className={[
            "text-[18px] italic font-semibold leading-[1.3] tracking-[-0.01em] md:text-[34px]",
            captionClr,
          ].join(" ")}
        >
          You don't own your audience.
        </p>
      </div>
    </div>
  );
}

function NewslettersWhoGraphic({ dark = false }: { dark?: boolean }) {
  const rows: { label: string; tone: "light" | "dark" }[][] = [
    [
      { label: "Past Clients", tone: "light" },
      { label: "SOI", tone: "light" },
      { label: "Friends", tone: "light" },
    ],
    [
      { label: "Family", tone: "dark" },
      { label: "Hot Leads", tone: "dark" },
      { label: "Cold Leads", tone: "dark" },
      { label: "New Leads", tone: "dark" },
    ],
    [
      { label: "Old Leads", tone: "light" },
      { label: "Buyers", tone: "light" },
      { label: "Sellers", tone: "light" },
      { label: "Renters", tone: "light" },
    ],
    [
      { label: "Investors", tone: "dark" },
      { label: "Vendors", tone: "dark" },
    ],
  ];

  const headlineColor = dark ? "text-paper" : "text-ink";

  return (
    <div className="relative mx-auto w-full max-w-[1040px] px-[0px]">
      <div className="mb-[32px] md:mb-[56px]">
        <div className={["text-[28px] font-black leading-[1.02] tracking-[-0.02em] md:text-[72px]", headlineColor].join(" ")}>
          Who Reads Newsletters?
        </div>
      </div>
      <div className="flex flex-col gap-[14px] md:gap-[22px]">
        {rows.map((row, r) => {
          const justify =
            r === 0
              ? "justify-center gap-[10px] md:gap-[32px]"
              : r === 1
                ? "justify-center gap-[10px] md:gap-[28px]"
                : r === 2
                  ? "justify-center gap-[10px] md:gap-[28px]"
                  : "justify-center gap-[10px] md:gap-[28px]";
          return (
            <div
              key={r}
              className={["flex flex-wrap items-center", justify].join(" ")}
            >
              {row.map((pill, p) => {
                const pillBg =
                  pill.tone === "light"
                    ? "bg-[#b39af2] text-white"
                    : "bg-[#7860c8] text-white";
                const size =
                  r === 0
                    ? "rounded-[14px] px-[16px] py-[10px] text-[15px] md:rounded-[18px] md:px-[28px] md:py-[16px] md:text-[30px]"
                    : r === 1
                      ? "rounded-[12px] px-[14px] py-[8px] text-[14px] md:rounded-[16px] md:px-[24px] md:py-[14px] md:text-[26px]"
                      : r === 2
                        ? "rounded-[14px] px-[16px] py-[10px] text-[15px] md:rounded-[18px] md:px-[26px] md:py-[15px] md:text-[28px]"
                        : "rounded-[12px] px-[16px] py-[10px] text-[15px] md:rounded-[16px] md:px-[28px] md:py-[15px] md:text-[28px]";
                return (
                  <div
                    key={p}
                    className={[
                      "shrink-0 font-bold tracking-[-0.01em]",
                      pillBg,
                      size,
                    ].join(" ")}
                  >
                    {pill.label}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
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
          ) : section.id === "02" ? (
            <div className="relative mx-auto w-full md:max-w-[1040px]">
              <NewslettersWhoGraphic dark={isDark} />
            </div>
          ) : section.id === "03" ? (
            <div className="relative mx-auto w-full md:max-w-[1040px]">
              <Funnel dark={isDark} />
            </div>
          ) : section.id === "05" ? (
            <div className="relative mx-auto w-full md:max-w-[1120px] pt-[16px]">
              <ReplyInboxGraphic dark={isDark} />
            </div>
          ) : section.id === "04" ? (
            <div className="relative mx-auto w-full md:max-w-[1040px]">
              <RentedPlatformsGraphic dark={isDark} />
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
              className="max-w-[1000px] text-[34px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[64px]"
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
            <div className="mt-[8px] grid grid-cols-1 gap-[20px] pt-[16px] md:grid-cols-3 md:gap-[48px]">
              {[
                { n: "hero-stat-1-number", l: "hero-stat-1-label" },
                { n: "hero-stat-2-number", l: "hero-stat-2-label" },
                { n: "hero-stat-3-number", l: "hero-stat-3-label" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-[6px]">
                  <div
                    className="text-[24px] font-bold leading-none tracking-[-0.02em] text-ink md:text-[32px]"
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

        <EmailLeadForm
          headline={read("contact-headline")}
          subhead={read("contact-subhead")}
        />
      </main>

      <Footer />
    </div>
  );
}
