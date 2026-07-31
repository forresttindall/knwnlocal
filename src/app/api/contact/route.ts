import { NextResponse } from "next/server";

type Body = {
  step1_qualified?: unknown;
  step2_role?: unknown;
  step3_bottleneck?: unknown;
  step4_firstName?: unknown;
  step4_lastName?: unknown;
  step4_phone?: unknown;
  step4_email?: unknown;
  step5_youtube?: unknown;
  step6_gci?: unknown;
  step7_timeline?: unknown;
  name?: unknown;
  email?: unknown;
  market?: unknown;
  pricePoint?: unknown;
  goal?: unknown;
  cadence?: unknown;
};

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const firstName = asString(body.step4_firstName);
  const lastName = asString(body.step4_lastName);
  const email = asString(body.step4_email) || asString(body.email);
  const legacyName = asString(body.name);
  const fullName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : legacyName;

  if (!fullName || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    name: fullName,
    email,
    firstName,
    lastName,
    phone: asString(body.step4_phone),
    qual_12plus_deals: asString(body.step1_qualified),
    role: asString(body.step2_role),
    bottleneck: asString(body.step3_bottleneck),
    youtube: asString(body.step5_youtube),
    gci: asString(body.step6_gci),
    timeline: asString(body.step7_timeline),
    market: asString(body.market),
    pricePoint: asString(body.pricePoint),
    goal: asString(body.goal),
    cadence: asString(body.cadence),
    source: firstName
      ? "knwnlocal-onboarding-flow"
      : "knwnlocal-contact-form",
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
