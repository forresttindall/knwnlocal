"use client";

import { DeployBanner } from "@/components/edit/DeployBanner";
import { EditModeProvider } from "@/components/edit/EditModeProvider";
import { EditPopover } from "@/components/edit/EditPopover";
import { EmailPlatformPage } from "@/components/pages/EmailPlatformPage";
import type { PageKey } from "@/lib/content/pageContent";

export function EditableEmailPageClient({
  enabled,
  initialValues,
}: {
  enabled: boolean;
  initialValues: Record<string, string>;
}) {
  const pageKey: Extract<PageKey, "email"> = "email";

  return (
    <EditModeProvider enabled={enabled} initialValues={initialValues} pageKey={pageKey}>
      <DeployBanner />
      <EmailPlatformPage fields={initialValues} editable={enabled} />
      <EditPopover />
    </EditModeProvider>
  );
}
