import type { Metadata } from "next";

import { EditableChannelPageClient } from "@/components/pages/EditableChannelPageClient";
import { getPageContent } from "@/lib/content/pageContent";

export const metadata: Metadata = {
  title: "YouTube | KnwnLocal",
  description:
    "YouTube strategy, scripting, and publishing for real estate agents who want to become the obvious name in their market.",
};

export default async function YouTubePage() {
  const initialValues = await getPageContent("youtube");
  const enabled = process.env.NEXT_PUBLIC_EDIT_MODE_ENABLED === "true";

  return (
    <EditableChannelPageClient
      pageKey="youtube"
      enabled={enabled}
      initialValues={initialValues}
    />
  );
}
