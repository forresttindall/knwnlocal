import { NextResponse } from "next/server";

export const runtime = "nodejs";

function badRequest(message: string, status = 400) {
  return new NextResponse(message, { status });
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return badRequest("Missing ANTHROPIC_API_KEY.", 500);
  }

  const body = (await req.json().catch(() => null)) as
    | {
        field?: string;
        current?: string;
        instruction?: string;
        context?: string;
      }
    | null;

  const field = body?.field?.trim();
  const current = body?.current ?? "";
  const instruction = body?.instruction?.trim();
  const context = body?.context ?? "";

  if (!field || !instruction) {
    return badRequest("Missing field or instruction.");
  }

  const system =
    "You are a brand copywriter for KnwnLocal, a realtor marketing agency. Voice: plainspoken, direct, confident. Short declarative sentences. Numbers over adjectives. Title Case for headlines, sentence case for body. Always spell Knwn not Known. No emoji, no exclamation marks in body, no words like unlock/leverage/10x/game-changing. One violet pill highlight per headline — wrap the payoff word in <highlight> tags.";

  const user = `Field: ${field}\nCurrent text: ${current}\nInstruction: ${instruction}\nContext: ${context}\nRewrite this content.`;

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system,
      messages: [{ role: "user", content: user }],
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return badRequest(errText || "Claude request failed.", 500);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const reader = upstream.body!.getReader();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!value) continue;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice("data:".length).trim();
            if (!payload || payload === "[DONE]") continue;

            let parsed: any;
            try {
              parsed = JSON.parse(payload);
            } catch {
              continue;
            }

            const deltaText: string | undefined =
              parsed?.delta?.text ??
              parsed?.content_block?.text ??
              parsed?.content_block_delta?.delta?.text ??
              parsed?.message?.delta?.text;

            if (typeof deltaText === "string" && deltaText.length > 0) {
              controller.enqueue(encoder.encode(deltaText));
            }
          }
        }
      } catch (e) {
        controller.error(e);
        return;
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

