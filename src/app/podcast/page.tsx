import type { Metadata } from "next";

import { EditableChannelPageClient } from "@/components/pages/EditableChannelPageClient";
import { getPageContent } from "@/lib/content/pageContent";

export const metadata: Metadata = {
  title: "Podcast | KnwnLocal",
  description:
    "Podcast planning and production support for real estate brands that want long-form trust, sharper positioning, and repurposable content.",
};

export default async function PodcastPage() {
  const initialValues = await getPageContent("podcast");
  const enabled = process.env.NEXT_PUBLIC_EDIT_MODE_ENABLED === "true";

  return (
    <EditableChannelPageClient
      pageKey="podcast"
      enabled={enabled}
      initialValues={initialValues}
    />
  );
}
