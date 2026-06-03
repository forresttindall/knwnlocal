import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { changes?: Record<string, string> }
    | null;

  const changes = body?.changes ?? {};

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  const missing: string[] = [];
  if (!projectId) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) missing.push("NEXT_PUBLIC_SANITY_DATASET");
  if (!token) missing.push("SANITY_API_TOKEN");
  if (!deployHookUrl) missing.push("VERCEL_DEPLOY_HOOK_URL");

  if (missing.length > 0) {
    return new NextResponse(`Missing env vars: ${missing.join(", ")}`, {
      status: 500,
    });
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-02-01",
    useCdn: false,
  });

  const homepageId = await client.fetch<string | null>(
    `*[_type=="homepage"][0]._id`,
  );

  const docId =
    homepageId ??
    (await client.create({
      _type: "homepage",
      heroHeadline: "",
      heroSubhead: "",
      stats: [],
    }))._id;

  const existing = await client.fetch<any>(`*[_id==$id][0]`, { id: docId });

  const next: Record<string, unknown> = {};

  if (typeof changes["hero-headline"] === "string") {
    next.heroHeadline = changes["hero-headline"];
  }
  if (typeof changes["hero-subhead"] === "string") {
    next.heroSubhead = changes["hero-subhead"];
  }

  const stats = Array.isArray(existing?.stats) ? [...existing.stats] : [];
  const ensureStat = (index: number) => {
    while (stats.length <= index) {
      stats.push({
        _type: "stat",
        _key: `stat-${stats.length + 1}`,
        number: "",
        label: "",
      });
    }
  };

  for (const [field, value] of Object.entries(changes)) {
    const m = field.match(/^hero-stat-(\d+)-(number|label)$/);
    if (!m) continue;
    const index = Number(m[1]) - 1;
    const key = m[2] as "number" | "label";
    if (Number.isNaN(index) || index < 0) continue;
    ensureStat(index);
    stats[index] = { ...stats[index], [key]: value };
  }

  if (stats.length > 0) {
    next.stats = stats;
  }

  await client.patch(docId).set(next).commit();

  const hookRes = await fetch(deployHookUrl!, { method: "POST" });
  if (!hookRes.ok) {
    const msg = await hookRes.text().catch(() => "");
    return new NextResponse(msg || "Vercel deploy hook failed.", { status: 500 });
  }

  return json({ ok: true, homepageId: docId });
}

