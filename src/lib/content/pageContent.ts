import { createClient } from "@sanity/client";

export const pageKeys = ["home", "youtube", "email", "podcast"] as const;

export type PageKey = (typeof pageKeys)[number];

export const pageMeta: Record<PageKey, { path: string; title: string }> = {
  home: { path: "/", title: "Home" },
  youtube: { path: "/youtube", title: "YouTube" },
  email: { path: "/email", title: "Email" },
  podcast: { path: "/podcast", title: "Podcast" },
};

export const defaultPageContent: Record<PageKey, Record<string, string>> = {
  home: {
    "nav-cta": "Check Availability",
    "hero-eyebrow": "Be Found, Get Knwn",
    "hero-headline": "You're Great At Real Estate. We Make It <highlight>Knwn</highlight>.",
    "hero-subhead":
      "Build a hyper-local brand that makes you the only choice. Clients seek you out. Agents want to join you. Competitors wonder how you're everywhere at once.",
    "hero-cta-primary": "Check Availability",
    "hero-cta-secondary": "See Pricing",
    "hero-trust":
      "Trusted by agents who want to own their market and stay top of mind.",
    "hero-stat-1-number": "758M",
    "hero-stat-1-label": "People reached",
    "hero-stat-2-number": "$11M+",
    "hero-stat-2-label": "In 2025 GCI for clients",
    "hero-stat-3-number": "100+",
    "hero-stat-3-label": "YouTube + newsletters",
    "hero-stat-4-number": "35+",
    "hero-stat-4-label": "Hours saved / month",
    "problem-headline":
      "Most Agents Don’t Need More Leads. They Need <highlight>Consistency</highlight>.",
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
    "availability-cta-primary": "Email Us",
    "availability-cta-secondary": "Review Pricing",
  },
  youtube: {
    "nav-cta": "Check Availability",
    "hero-eyebrow": "YouTube Growth For Real Estate",
    "hero-headline":
      "Turn One Weekly Video Into Market <highlight>Authority</highlight>.",
    "hero-subhead":
      "We build the topic plan, script, thumbnail angle, and publishing rhythm so your channel keeps showing up when buyers and sellers start searching.",
    "hero-cta-primary": "Check Availability",
    "hero-cta-secondary": "Explore Email",
    "hero-stat-1-number": "4x",
    "hero-stat-1-label": "Videos turned into weekly content momentum",
    "hero-stat-2-number": "1",
    "hero-stat-2-label": "Clear filming session instead of scattered drafts",
    "hero-stat-3-number": "52",
    "hero-stat-3-label": "Weeks of search-first local authority",
    "promise-headline":
      "What Your YouTube System Needs To <highlight>Do</highlight>.",
    "promise-1-title": "Own local search intent",
    "promise-1-body":
      "We plan topics around the questions buyers and sellers actually type when they are close to making a move.",
    "promise-2-title": "Keep your filming simple",
    "promise-2-body":
      "You show up, record, and stay on message. We handle the prep work that usually slows the whole system down.",
    "promise-3-title": "Stay consistent for months",
    "promise-3-body":
      "The goal is not one good upload. The goal is a repeatable cadence that makes you look active, credible, and hard to ignore.",
    "process-headline":
      "A Three-Step YouTube Flow That Keeps You <highlight>Visible</highlight>.",
    "process-1-title": "Plan",
    "process-2-title": "Film",
    "process-3-title": "Publish",
    "cta-headline":
      "Ready To Make Your Market Search You <highlight>First</highlight>?",
    "cta-body":
      "Tell us your market, your niche, and how often you want to publish. We will tell you if the YouTube offer fits.",
  },
  email: {
    "nav-cta": "Check Availability",
    "hero-eyebrow": "Email Newsletters For Real Estate",
    "hero-headline":
      "Stay Top Of Mind With Weekly Email <highlight>Cadence</highlight>.",
    "hero-subhead":
      "We help you send the kind of email people actually open: local, clear, personal, and tied to the conversations already happening in your market.",
    "hero-cta-primary": "Check Availability",
    "hero-cta-secondary": "Explore Podcast",
    "hero-stat-1-number": "1x",
    "hero-stat-1-label": "Weekly touchpoint with your SOI and database",
    "hero-stat-2-number": "0",
    "hero-stat-2-label": "Guesswork around what to send next",
    "hero-stat-3-number": "12",
    "hero-stat-3-label": "Months of compounding market familiarity",
    "promise-headline":
      "What A Better Email System Should <highlight>Fix</highlight>.",
    "promise-1-title": "Give you a steady voice",
    "promise-1-body":
      "Your newsletter should sound like you on a good strategy call. Clear point of view. No filler. No empty market recap.",
    "promise-2-title": "Create repeatable opens",
    "promise-2-body":
      "Strong subject lines and local angles make it easier to earn attention without resorting to hype.",
    "promise-3-title": "Move people toward reply",
    "promise-3-body":
      "The best emails feel personal enough to answer. That is where referrals, listing conversations, and warm follow-up start.",
    "process-headline":
      "The Email Workflow That Builds Weekly <highlight>Recall</highlight>.",
    "process-1-title": "Angle",
    "process-2-title": "Write",
    "process-3-title": "Send",
    "cta-headline":
      "Want A Newsletter People Actually <highlight>Read</highlight>?",
    "cta-body":
      "Send us your market, your audience, and your current cadence. We will map the simplest version that keeps you present every week.",
  },
  podcast: {
    "nav-cta": "Check Availability",
    "hero-eyebrow": "Podcast Strategy For Real Estate Brands",
    "hero-headline":
      "Build Long-Form Trust People Keep Coming Back To For <highlight>Weeks</highlight>.",
    "hero-subhead":
      "We shape the show angle, episode structure, and repurposing plan so every recording session turns into more reach, more authority, and more usable content.",
    "hero-cta-primary": "Check Availability",
    "hero-cta-secondary": "Explore YouTube",
    "hero-stat-1-number": "1",
    "hero-stat-1-label": "Recording session turned into multi-channel content",
    "hero-stat-2-number": "30+",
    "hero-stat-2-label": "Minutes of trust-building long-form attention",
    "hero-stat-3-number": "3x",
    "hero-stat-3-label": "More ways to repurpose the same conversation",
    "promise-headline":
      "What A Strong Podcast Offer Should <highlight>Create</highlight>.",
    "promise-1-title": "Clear positioning",
    "promise-1-body":
      "A good show gives your market a reason to remember what you stand for, who you speak to, and why your point of view is different.",
    "promise-2-title": "Better guest conversations",
    "promise-2-body":
      "We help frame the episode so you get stronger stories, cleaner takeaways, and clips worth reusing later.",
    "promise-3-title": "More mileage per episode",
    "promise-3-body":
      "One interview should not end as one upload. The system should keep feeding your social, email, and video channels after the recording ends.",
    "process-headline":
      "The Podcast Rhythm That Makes Your Brand More <highlight>Memorable</highlight>.",
    "process-1-title": "Frame",
    "process-2-title": "Record",
    "process-3-title": "Repurpose",
    "cta-headline":
      "Need A Podcast Strategy That Pulls More Weight Per <highlight>Episode</highlight>?",
    "cta-body":
      "Tell us what kind of show you want to run and who it should reach. We will show you the simplest format that keeps the content useful after you hit record.",
  },
};

function getReadClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2025-02-06",
    useCdn: false,
  });
}

function normalizeStringRecord(
  value: Record<string, unknown> | null | undefined,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value ?? {}).filter(
      (entry): entry is [string, string] =>
        typeof entry[0] === "string" && typeof entry[1] === "string",
    ),
  );
}

export function isPageKey(value: string): value is PageKey {
  return (pageKeys as readonly string[]).includes(value);
}

export async function getPageContent(pageKey: PageKey) {
  const defaults = defaultPageContent[pageKey];
  const client = getReadClient();

  if (!client) {
    return { ...defaults };
  }

  try {
    const doc = await client.fetch<{ fields?: Record<string, unknown> } | null>(
      `*[_type == "sitePage" && pageKey == $pageKey][0]{fields}`,
      { pageKey },
    );

    return {
      ...defaults,
      ...normalizeStringRecord(doc?.fields),
    };
  } catch {
    return { ...defaults };
  }
}
