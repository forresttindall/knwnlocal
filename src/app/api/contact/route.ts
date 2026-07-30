import { NextResponse } from "next/server";

type Body = {
  name?: unknown;
  email?: unknown;
  market?: unknown;
  pricePoint?: unknown;
  goal?: unknown;
  cadence?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = isNonEmptyString(body.name) ? body.name.trim() : null;
  const email = isNonEmptyString(body.email) ? body.email.trim() : null;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    name,
    email,
    market: typeof body.market === "string" ? body.market.trim() : "",
    pricePoint: typeof body.pricePoint === "string" ? body.pricePoint.trim() : "",
    goal: typeof body.goal === "string" ? body.goal.trim() : "",
    cadence: typeof body.cadence === "string" ? body.cadence.trim() : "",
    source: "knwnlocal-contact-form",
  };

  console.log("[contact:submission]", JSON.stringify(payload));

  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        console.warn(
          "[contact:webhook] non-2xx",
          r.status,
          await r.text().catch(() => ""),
        );
      }
    } catch (e) {
      console.warn(
        "[contact:webhook] failed",
        e instanceof Error ? e.message : String(e),
      );
    }
  }

  return NextResponse.json({ ok: true });
}
