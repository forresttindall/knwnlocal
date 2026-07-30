import type { Metadata } from "next";

import { EditableEmailPageClient } from "@/components/pages/EditableEmailPageClient";
import { getPageContent } from "@/lib/content/pageContent";

export const metadata: Metadata = {
  title: "Email Platform | KnwnLocal",
  description:
    "KnwnLocal Email Platform for real estate agents. Weekly local newsletters, writing, design, delivery, and metrics — turn your database into conversations, referrals, and signed listings.",
};

export default async function EmailPage() {
  const initialValues = await getPageContent("email");
  const enabled = process.env.NEXT_PUBLIC_EDIT_MODE_ENABLED === "true";

  return (
    <EditableEmailPageClient
      enabled={enabled}
      initialValues={initialValues}
    />
  );
}
