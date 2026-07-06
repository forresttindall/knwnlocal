import type { Metadata } from "next";

import { ChannelPage } from "@/components/pages/ChannelPage";

export const metadata: Metadata = {
  title: "Email | KnwnLocal",
  description:
    "Email newsletter strategy and writing for real estate agents who want to stay top of mind with their SOI every single week.",
};

export default function EmailPage() {
  return (
    <ChannelPage
      slug="email"
      eyebrow="Email Newsletters For Real Estate"
      headline="Stay Top Of Mind With Weekly Email <highlight>Cadence</highlight>."
      subhead="We help you send the kind of email people actually open: local, clear, personal, and tied to the conversations already happening in your market."
      primaryCtaLabel="Check Availability"
      primaryCtaHref="mailto:hello@knwnlocal.com?subject=KnwnLocal%20Email"
      secondaryCtaLabel="Explore Podcast"
      secondaryCtaHref="/podcast"
      stats={[
        { number: "1x", label: "Weekly touchpoint with your SOI and database" },
        { number: "0", label: "Guesswork around what to send next" },
        { number: "12", label: "Months of compounding market familiarity" },
      ]}
      promiseHeadline="What A Better Email System Should <highlight>Fix</highlight>."
      promiseCards={[
        {
          title: "Give you a steady voice",
          body: "Your newsletter should sound like you on a good strategy call. Clear point of view. No filler. No empty market recap.",
        },
        {
          title: "Create repeatable opens",
          body: "Strong subject lines and local angles make it easier to earn attention without resorting to hype.",
        },
        {
          title: "Move people toward reply",
          body: "The best emails feel personal enough to answer. That is where referrals, listing conversations, and warm follow-up start.",
        },
      ]}
      processHeadline="The Email Workflow That Builds Weekly <highlight>Recall</highlight>."
      processSteps={["Angle", "Write", "Send"]}
      ctaHeadline="Want A Newsletter People Actually <highlight>Read</highlight>?"
      ctaBody="Send us your market, your audience, and your current cadence. We will map the simplest version that keeps you present every week."
    />
  );
}
