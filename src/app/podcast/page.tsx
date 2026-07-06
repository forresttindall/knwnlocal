import type { Metadata } from "next";

import { ChannelPage } from "@/components/pages/ChannelPage";

export const metadata: Metadata = {
  title: "Podcast | KnwnLocal",
  description:
    "Podcast planning and production support for real estate brands that want long-form trust, sharper positioning, and repurposable content.",
};

export default function PodcastPage() {
  return (
    <ChannelPage
      slug="podcast"
      eyebrow="Podcast Strategy For Real Estate Brands"
      headline="Build Long-Form Trust People Keep Coming Back To For <highlight>Weeks</highlight>."
      subhead="We shape the show angle, episode structure, and repurposing plan so every recording session turns into more reach, more authority, and more usable content."
      primaryCtaLabel="Check Availability"
      primaryCtaHref="mailto:hello@knwnlocal.com?subject=KnwnLocal%20Podcast"
      secondaryCtaLabel="Explore YouTube"
      secondaryCtaHref="/youtube"
      stats={[
        { number: "1", label: "Recording session turned into multi-channel content" },
        { number: "30+", label: "Minutes of trust-building long-form attention" },
        { number: "3x", label: "More ways to repurpose the same conversation" },
      ]}
      promiseHeadline="What A Strong Podcast Offer Should <highlight>Create</highlight>."
      promiseCards={[
        {
          title: "Clear positioning",
          body: "A good show gives your market a reason to remember what you stand for, who you speak to, and why your point of view is different.",
        },
        {
          title: "Better guest conversations",
          body: "We help frame the episode so you get stronger stories, cleaner takeaways, and clips worth reusing later.",
        },
        {
          title: "More mileage per episode",
          body: "One interview should not end as one upload. The system should keep feeding your social, email, and video channels after the recording ends.",
        },
      ]}
      processHeadline="The Podcast Rhythm That Makes Your Brand More <highlight>Memorable</highlight>."
      processSteps={["Frame", "Record", "Repurpose"]}
      ctaHeadline="Need A Podcast Strategy That Pulls More Weight Per <highlight>Episode</highlight>?"
      ctaBody="Tell us what kind of show you want to run and who it should reach. We will show you the simplest format that keeps the content useful after you hit record."
    />
  );
}
