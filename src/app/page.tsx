import { HomePageClient } from "@/components/pages/HomePageClient";
import { getPageContent } from "@/lib/content/pageContent";

export default async function Home() {
  const initialValues = await getPageContent("home");
  const enabled = process.env.NEXT_PUBLIC_EDIT_MODE_ENABLED === "true";

  return <HomePageClient enabled={enabled} initialValues={initialValues} />;
}
