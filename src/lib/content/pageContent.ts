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
      "Our <highlight>Clients</highlight> are our Best Salespeople.",
    "problem-1-name": "Lindsey",
    "problem-1-thumb": "/images/Lindsey.webp",
    "problem-1-video": "https://www.youtube.com/watch?v=9TBhz94UvrA",
    "problem-2-name": "Will",
    "problem-2-thumb": "/images/will.jpg",
    "problem-2-video": "https://www.youtube.com/watch?v=-fEu9yylAsc",
    "problem-3-name": "Matt",
    "problem-3-thumb": "/images/matt.jpg",
    "problem-3-video": "https://www.youtube.com/watch?v=dEmb-0zqAt4",
    "problem-1-title": "No repeatable system",
    "problem-1-body":
      "You post when you have time. Your audience forgets you fast.",
    "problem-2-title": "Content takes too long",
    "problem-2-body":
      "You can sell houses or you can edit. Most weeks you end up doing neither well.",
    "problem-3-title": "Good ideas die in drafts",
    "problem-3-body":
      "You know what to say. Scripts, thumbnails, and scheduling are the bottleneck.",
    "process-headline":
      "You spend <highlight>1 hour per week</highlight> filming. We do the rest.",
    "process-1-title": "We Develop Strategies",
    "process-2-title": "We Write Scripts",
    "process-3-title": "You Film Videos",
    "process-4-title": "We Edit Videos",
    "process-5-title": "We Post Videos",
    "social-headline":
      "Our videos generate <highlight>high-quality leads</highlight>.",
    "social-1-thumb": "/images/maxresdefault%20(17).jpg",
    "social-1-video": "",
    "social-2-thumb": "/images/lvrich.png",
    "social-2-video": "",
    "social-3-thumb": "/images/maxresdefault%20(16).jpg",
    "social-3-video": "",
    "social-4-thumb": "/images/37,000%20views.jpg",
    "social-4-video": "",
    "social-5-thumb": "/images/maxresdefault%20(14).jpg",
    "social-5-video": "",
    "social-6-thumb": "/images/25,000%20views.jpg",
    "social-6-video": "",
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
    "contact-headline": "Tell us about your <highlight>business</highlight>.",
    "contact-subhead":
      "One short form. We’ll reply with availability, a clear scope, and next steps — no cold calls, no long intake.",
    "availability-headline":
      "Check Availability In <highlight>Two Minutes</highlight>.",
    "availability-body":
      "Tell us your market, your price point, and what you want to be Knwn for. We’ll reply with openings and next steps.",
    "availability-cta-primary": "Email Us",
    "availability-cta-secondary": "Review Pricing",
  },
  youtube: {
    "nav-cta": "Check Availability",
    "hero-eyebrow": "KnwnLocal YouTube Platform",
    "hero-headline":
      "A YouTube publishing platform for agents who want to be the <highlight>name</highlight> in their market.",
    "hero-subhead":
      "We plan, film, edit, publish, and report on your channel on a schedule. You show up once a week in front of a camera — we do the rest. No case studies, no portfolios, no creative lottery — just consistent weekly output in your market.",
    "hero-cta-primary": "Check availability",
    "hero-cta-secondary": "Read the 6 reasons",
    "section-demand-headline":
      "The demand is higher than the <highlight>supply</highlight>.",
    "section-demand-copy":
      "Most agent channels publish once every few months and stop at 30–300 views. Once a channel is planned, filmed, and published consistently to a single local market, the gap closes fast — and the first agent to publish on a topic keeps the traffic for years.",
    "section-1-shot-agent-1": "/images/54 views.jpg",
    "section-1-shot-1-caption": "Her last 2 videos without us",
    "section-1-shot-1-stats": "51 views · 286 views",
    "section-1-shot-agent-2": "/images/37,000 views.jpg",
    "section-1-shot-2-caption": "Her first 2 videos with KnwnLocal",
    "section-1-shot-2-stats": "37,000 views · 8,600 views",
    "section-1-footnote":
      "Same agent, same market, same camera. Planning + editing + publishing consistency is what changed.",
    "section-attention-headline":
      "YouTube is the only platform that holds <highlight>people's attention</highlight>.",
    "section-attention-copy":
      "A short-form Reel or TikTok is usually skipped in under 8 seconds. A well-structured YouTube walkthrough, tour, or market breakdown keeps a viewer for minutes — our best clients average 8+ minutes of watch time per video. That's enough time to trust someone, not just scroll past them.",
    "section-2-shot": "/images/6,800 views.jpg",
    "section-intent-headline":
      "High-intent buyers and sellers find you via <highlight>Google, YouTube, and AI chat</highlight>.",
    "section-intent-copy":
      "When a serious buyer starts their search, they don't type your name. They type things into Google, ask YouTube, or prompt AI assistants. YouTube is the most-cited video platform in AI answers — and the answers that actually explain a market beat the listing-portal noise every time.",
    "section-3-shot": "/images/9,000 views.jpg",
    "section-bigscreen-headline":
      "YouTube videos are being watched on the <highlight>big screen</highlight>, not the small screen.",
    "section-bigscreen-copy":
      "A huge slice of our viewership streams on TVs — couples, families, empty-nesters, people who don't use Instagram or TikTok at all. The buyer on their couch with a glass of wine watching a 12-minute neighborhood tour is the one writing the offer, not the scroller in the checkout line.",
    "section-4-shot": "/images/9,000 views.jpg",
    "section-authority-headline":
      "People get hooked and watch <highlight>hours</highlight> of your content before they reach out.",
    "section-authority-copy":
      "One video gets them in the door. Six videos later, they've watched a tour, a market report, a listing process walkthrough, and three client stories. By the time they email, you're already the expert they want to work with — not the 3rd agent they're cold-calling.",
    "section-5-shot": "/images/maxresdefault (14).jpg",
    "section-quality-headline":
      "YouTube leads are the <highlight>highest-quality leads</highlight> in real estate.",
    "section-quality-copy":
      "Most internet leads are just looking for a house and will treat you like an order taker. YouTube leads are looking for help — they're looking for someone to explain a market, a process, or a neighborhood to them. We have clients who convert 1 in 6 of these leads into signed clients.",
    "section-6-shot": "/images/6,800 views.jpg",
    "testimonial-sally-quote":
      "Within one month of publishing through KnwnLocal, our calendar was full of buyers we wouldn't have met any other way. No open houses. No paid leads. Just people watching our channel and picking up the phone.",
    "testimonial-sally-name": "Sally Daley",
    "testimonial-sally-role": "Sally Daley Real Estate",
    "testimonial-sally-headshot": "/images/Sally+Daley.webp",
    "testimonial-sally-thumb": "/images/37,000 views.jpg",
    "testimonial-sally-video": "https://www.youtube.com/watch?v=3a-YvWNJONI",
    "testimonial-micah-quote":
      "We used to buy every internet lead we could get. Now the first call of the week is someone who watched four of our videos over the weekend and already knows exactly which neighborhood they want. It's a different kind of lead.",
    "testimonial-micah-name": "Micah Bleecher",
    "testimonial-micah-role": "Bleecher Group",
    "testimonial-micah-headshot": "/images/micah bleecher.jpeg",
    "testimonial-micah-thumb": "/images/maxresdefault (18).jpg",
    "testimonial-micah-video": "",
    "contact-headline": "Tell us about your <highlight>business</highlight>.",
    "contact-subhead":
      "One short form. We'll reply with platform availability, scope, and next steps.",
  },
  email: {
    "nav-cta": "Check Availability",
    "hero-eyebrow": "Email Marketing For Real Estate",
    "hero-headline":
      "Email is the <highlight>#1 channel</highlight> for ROI, lead quality, and listings.",
    "hero-subhead":
      "Stop relying on algorithms to surface your name in a feed. A weekly local newsletter builds direct relationships with the people who already know you — and turns your database into repeat conversations, referrals, and signed listings.",
    "hero-cta-primary": "Check Availability",
    "hero-cta-secondary": "See YouTube Platform",
    "hero-stat-1-number": "#1",
    "hero-stat-1-label": "Channel for digital marketing ROI",
    "hero-stat-2-number": "#1",
    "hero-stat-2-label": "Channel for B2C marketing ROI",
    "hero-stat-3-number": "40.8%",
    "hero-stat-3-label": "Rate leads good or excellent (vs 25% avg)",
    "section-01-eyebrow": "Section 01",
    "section-01-headline":
      "The data backs it up. Email is the <highlight>most effective channel</highlight> you have.",
    "section-01-copy":
      "Every independent channel ranking says the same thing: email outperforms social, paid, mailers, and sign calls for lead quality, conversion, and listings. It is the #1 ROI channel in digital marketing and the #1 ROI channel in B2C. Social media posts get skipped in 8 seconds or less. An email lands in an inbox someone already checks, opened by someone who already knows your name.",
    "section-01-shot-1": "/images/Email Newsletter Design.png",
    "section-01-caption-1": "Email vs. social — conversion rate comparison",
    "section-01-stats-1": "3× better or more — every category",
    "section-01-shot-2": "/images/Email Newsletter Design 2.png",
    "section-01-caption-2": "Best channels for lead quality — ranked",
    "section-01-stats-2": "Email 40.8% · Open houses 30.3% · Website 30.1%",
    "section-02-eyebrow": "Section 02",
    "section-02-headline":
      "Email newsletters have <highlight>mass appeal</highlight>. Listings and market reports don't.",
    "section-02-copy":
      "A listing-only email gets opened by 3 people: the seller, their spouse, and their mom. A newsletter that covers restaurants, events, school districts, market movement, and a strong local point of view gets opened by everyone in your database — past clients, sphere, friends, family, leads old and new, buyers, sellers, renters, investors, and vendors. The bigger the audience that looks forward to hearing from you, the more conversations you get to have.",
    "section-02-shot": "/images/Email Newsletter Design.png",
    "section-03-eyebrow": "Section 03",
    "section-03-headline":
      "Newsletters touch the <highlight>entire marketing funnel</highlight>.",
    "section-03-copy":
      "Top of funnel you send local events, restaurants, and news — the kind of thing people forward to their spouse. Middle of funnel you send listings, market stats, and tie-ins to your YouTube content. Bottom of funnel you send reviews, home value updates, and listings that actually match someone's stated criteria. One channel does the work of three. And every issue reinforces the same thing: you are the local expert they already know.",
    "section-03-shot": "/images/Email Newsletter Design 2.png",
    "section-04-eyebrow": "Section 04",
    "section-04-headline":
      "You own your list. No algorithm. No <highlight>Zillow-proof</highlight> surprises.",
    "section-04-copy":
      "A social media account can get throttled, shadow-banned, or made obsolete by a product update. A portal lead goes to four agents at once and you never hear from them again. An email list is a direct, owned asset full of people who already know, like, and trust you enough to give you their inbox. It is the only channel in real estate that compounds forever — you don't have to re-earn the right to speak to your audience every week.",
    "section-04-shot": "/images/Email Newsletter Design 2.png",
    "section-05-eyebrow": "Section 05",
    "section-05-headline":
      "Emails start <highlight>conversations</highlight>. Conversations create customers.",
    "section-05-copy":
      "A listing portal sends people to a form. A good email sends people to reply. Reply threads turn into phone calls, coffee meetings, listing appointments, and referrals. The real value of an email list is not the open rate — it's the number of people who feel like they know you well enough to type back, \"Hey, I've been thinking about selling.\"",
    "testimonial-glennda-quote":
      "Your team sent out an email from me at 2:06 PM, and it is now 3:04 PM — we've already had <highlight>5 responses</highlight>. One person is about to list her house with us, another is interested in selling, and someone else wants to know their home's worth. Thank you for creating an amazing product.",
    "testimonial-glennda-headshot": "/images/Glennda Baker.png",
    "testimonial-glennda-name": "Glennda Baker",
    "testimonial-glennda-role": "Real Estate Agent · Atlanta, GA",
    "contact-headline": "Tell us about your <highlight>database</highlight>.",
    "contact-subhead":
      "One short form. We'll reply with newsletter platform availability, scope, and next steps.",
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
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !dataset) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    token,
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
        typeof entry[0] === "string" &&
        typeof entry[1] === "string" &&
        entry[1].trim() !== "",
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
