import { readFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import {
  buildDesignAwareSystemPrompt,
  buildDesignAwareUserPrompt,
} from "@/lib/ai/designAwarePrompt";

export const runtime = "nodejs";

function badRequest(message: string, status = 400) {
  return new NextResponse(message, { status });
}

function parseClaudePatch(text: string) {
  const attempts = [
    text,
    text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""),
  ];

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    attempts.push(text.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate) as Record<string, unknown>;
      if (parsed && !Array.isArray(parsed) && typeof parsed === "object") {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-5";
  if (!apiKey) {
    return badRequest("Missing ANTHROPIC_API_KEY.", 500);
  }

  const body = (await req.json().catch(() => null)) as
    | {
        field?: string;
        current?: string;
        instruction?: string;
        context?: string;
        currentContentObject?: Record<string, string>;
      }
    | null;

  const field = body?.field?.trim();
  const current = body?.current ?? "";
  const instruction = body?.instruction?.trim();
  const context = body?.context ?? "";
  const currentContentObject = Object.fromEntries(
    Object.entries(body?.currentContentObject ?? {}).filter(
      (entry): entry is [string, string] =>
        typeof entry[0] === "string" && typeof entry[1] === "string",
    ),
  );

  if (!field || !instruction) {
    return badRequest("Missing field or instruction.");
  }

  const designMdPath = path.join(process.cwd(), "design.md");
  const designMdContent = await readFile(designMdPath, "utf8").catch(() => null);

  if (!designMdContent) {
    return badRequest("Missing design.md.", 500);
  }

  const promptContentObject =
    Object.keys(currentContentObject).length > 0
      ? currentContentObject
      : { [field]: current };

  const system = buildDesignAwareSystemPrompt({
    designMdContent,
    currentContentObject: promptContentObject,
  });
  const user = buildDesignAwareUserPrompt({
    instruction,
    field,
    current,
    context,
  });

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    return badRequest(errText || `Claude request failed for model "${model}".`, 500);
  }

  const payload = (await upstream.json().catch(() => null)) as
    | {
        content?: Array<{ type?: string; text?: string }>;
      }
    | null;

  const text = payload?.content
    ?.filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) {
    return badRequest("Claude returned an empty response.", 500);
  }

  const patch = parseClaudePatch(text);

  if (!patch) {
    return badRequest("Claude returned invalid JSON.", 500);
  }

  const value = patch[field];
  if (typeof value !== "string") {
    return badRequest(`Claude patch did not include a string value for "${field}".`, 500);
  }

  return NextResponse.json(
    { patch, value },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
