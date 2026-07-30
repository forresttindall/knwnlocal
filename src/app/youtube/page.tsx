import type { Metadata } from "next";

import { EditableYouTubePageClient } from "@/components/pages/EditableYouTubePageClient";
import { getPageContent } from "@/lib/content/pageContent";

export const metadata: Metadata = {
  title: "YouTube Platform | KnwnLocal",
  description:
    "KnwnLocal YouTube Platform for real estate agents. Prompt sheets, hook library, edits, captions, uploads, and weekly recaps — 1 hour filming per week, 8 videos shipped per quarter.",
};

export default async function YouTubePage() {
  const initialValues = await getPageContent("youtube");
  const enabled = process.env.NEXT_PUBLIC_EDIT_MODE_ENABLED === "true";

  return (
    <EditableYouTubePageClient
      enabled={enabled}
      initialValues={initialValues}
    />
  );
}
