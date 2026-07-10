import type { Metadata } from "next";

import { EditableChannelPageClient } from "@/components/pages/EditableChannelPageClient";
import { getPageContent } from "@/lib/content/pageContent";

export const metadata: Metadata = {
  title: "Email | KnwnLocal",
  description:
    "Email newsletter strategy and writing for real estate agents who want to stay top of mind with their SOI every single week.",
};

export default async function EmailPage() {
  const initialValues = await getPageContent("email");
  const enabled = process.env.NEXT_PUBLIC_EDIT_MODE_ENABLED === "true";

  return (
    <EditableChannelPageClient
      pageKey="email"
      enabled={enabled}
      initialValues={initialValues}
    />
  );
}
