"use client";

import { DeployBanner } from "@/components/edit/DeployBanner";
import { EditModeProvider } from "@/components/edit/EditModeProvider";
import { EditPopover } from "@/components/edit/EditPopover";
import { ChannelPage } from "@/components/pages/ChannelPage";
import type { PageKey } from "@/lib/content/pageContent";

export function EditableChannelPageClient({
  pageKey,
  enabled,
  initialValues,
}: {
  pageKey: Exclude<PageKey, "home">;
  enabled: boolean;
  initialValues: Record<string, string>;
}) {
  return (
    <EditModeProvider enabled={enabled} initialValues={initialValues} pageKey={pageKey}>
      <DeployBanner />
      <ChannelPage slug={pageKey} fields={initialValues} editable={enabled} />
      <EditPopover />
    </EditModeProvider>
  );
}
