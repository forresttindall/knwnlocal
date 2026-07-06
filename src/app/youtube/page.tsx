import type { Metadata } from "next";

import { ChannelPage } from "@/components/pages/ChannelPage";

export const metadata: Metadata = {
  title: "YouTube | KnwnLocal",
  description:
    "YouTube strategy, scripting, and publishing for real estate agents who want to become the obvious name in their market.",
};

export default function YouTubePage() {
  return (
    <ChannelPage
      slug="youtube"
      eyebrow="YouTube Growth For Real Estate"
      headline="Turn One Weekly Video Into Market <highlight>Authority</highlight>."
      subhead="We build the topic plan, script, thumbnail angle, and publishing rhythm so your channel keeps showing up when buyers and sellers start searching."
      primaryCtaLabel="Check Availability"
      primaryCtaHref="mailto:hello@knwnlocal.com?subject=KnwnLocal%20YouTube"
      secondaryCtaLabel="Explore Email"
      secondaryCtaHref="/email"
      stats={[
        { number: "4x", label: "Videos turned into weekly content momentum" },
        { number: "1", label: "Clear filming session instead of scattered drafts" },
        { number: "52", label: "Weeks of search-first local authority" },
      ]}
      promiseHeadline="What Your YouTube System Needs To <highlight>Do</highlight>."
      promiseCards={[
        {
          title: "Own local search intent",
          body: "We plan topics around the questions buyers and sellers actually type when they are close to making a move.",
        },
        {
          title: "Keep your filming simple",
          body: "You show up, record, and stay on message. We handle the prep work that usually slows the whole system down.",
        },
        {
          title: "Stay consistent for months",
          body: "The goal is not one good upload. The goal is a repeatable cadence that makes you look active, credible, and hard to ignore.",
        },
      ]}
      processHeadline="A Three-Step YouTube Flow That Keeps You <highlight>Visible</highlight>."
      processSteps={["Plan", "Film", "Publish"]}
      ctaHeadline="Ready To Make Your Market Search You <highlight>First</highlight>?"
      ctaBody="Tell us your market, your niche, and how often you want to publish. We will tell you if the YouTube offer fits."
    />
  );
}
