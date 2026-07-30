"use client";

import { DeployBanner } from "@/components/edit/DeployBanner";
import { EditModeProvider } from "@/components/edit/EditModeProvider";
import { EditPopover } from "@/components/edit/EditPopover";
import { YouTubePlatformPage } from "@/components/pages/YouTubePlatformPage";
import type { PageKey } from "@/lib/content/pageContent";

export function EditableYouTubePageClient({
  enabled,
  initialValues,
}: {
  enabled: boolean;
  initialValues: Record<string, string>;
}) {
  const pageKey: Extract<PageKey, "youtube"> = "youtube";

  return (
    <EditModeProvider enabled={enabled} initialValues={initialValues} pageKey={pageKey}>
      <DeployBanner />
      <YouTubePlatformPage fields={initialValues} editable={enabled} />
      <EditPopover />
    </EditModeProvider>
  );
}
