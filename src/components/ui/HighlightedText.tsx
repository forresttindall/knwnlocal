import * as React from "react";

import { HighlightPill } from "./HighlightPill";

export function HighlightedText({
  text,
  variant = "pill",
}: {
  text: string;
  variant?: "pill" | "block";
}) {
  const open = text.indexOf("<highlight>");
  const close = text.indexOf("</highlight>");

  if (open === -1 || close === -1 || close <= open) {
    return <>{text}</>;
  }

  const before = text.slice(0, open);
  const inside = text.slice(open + "<highlight>".length, close);
  const after = text.slice(close + "</highlight>".length);

  return (
    <>
      {before}
      <HighlightPill variant={variant}>{inside}</HighlightPill>
      {after}
    </>
  );
}
