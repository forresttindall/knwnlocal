import { createClient } from "@sanity/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  defaultPageContent,
  isPageKey,
  pageMeta,
  type PageKey,
} from "@/lib/content/pageContent";

export const runtime = "nodejs";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

function normalizeStringRecord(
  value: Record<string, unknown> | null | undefined,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value ?? {}).filter(
      (entry): entry is [string, string] =>
        typeof entry[0] === "string" && typeof entry[1] === "string",
    ),
  );
}

async function upsertPageContent(pageKey: PageKey, changes: Record<string, string>) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;

  const missing: string[] = [];
  if (!projectId) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) missing.push("NEXT_PUBLIC_SANITY_DATASET");
  if (!token) missing.push("SANITY_API_TOKEN");

  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2025-02-06",
    useCdn: false,
  });

  const existing = await client.fetch<{ _id: string; fields?: Record<string, unknown> } | null>(
    `*[_type == "sitePage" && pageKey == $pageKey][0]{_id, fields}`,
    { pageKey },
  );

  const docId =
    existing?._id ??
    `sitePage.${pageKey}`;

  const nextFields = {
    ...defaultPageContent[pageKey],
    ...normalizeStringRecord(existing?.fields),
    ...changes,
  };

  await client.createIfNotExists({
    _id: docId,
    _type: "sitePage",
    pageKey,
    title: pageMeta[pageKey].title,
    path: pageMeta[pageKey].path,
    fields: defaultPageContent[pageKey],
    createdAt: new Date().toISOString(),
  });

  await client
    .patch(docId)
    .set({
      title: pageMeta[pageKey].title,
      path: pageMeta[pageKey].path,
      fields: nextFields,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

async function triggerVercelDeploy() {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHookUrl || deployHookUrl.includes("...")) {
    return {
      triggered: false,
      warning: "Vercel deploy hook is not configured, so publish skipped the deploy trigger.",
    };
  }

  try {
    const hookRes = await fetch(deployHookUrl, { method: "POST" });
    if (!hookRes.ok) {
      const msg = await hookRes.text().catch(() => "");
      return {
        triggered: false,
        warning: msg || "Vercel deploy hook failed.",
      };
    }
  } catch (error) {
    return {
      triggered: false,
      warning: error instanceof Error ? error.message : "Vercel deploy hook failed.",
    };
  }

  return { triggered: true };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { pageKey?: string; changes?: Record<string, string> }
    | null;

  if (!body?.pageKey || !isPageKey(body.pageKey)) {
    return new NextResponse("Missing or invalid pageKey.", { status: 400 });
  }

  const pageKey = body.pageKey;
  const changes = normalizeStringRecord(body.changes);

  if (Object.keys(changes).length === 0) {
    return new NextResponse("No content changes were provided.", { status: 400 });
  }

  try {
    await upsertPageContent(pageKey, changes);
    revalidatePath(pageMeta[pageKey].path);

    const deploy = await triggerVercelDeploy();

    return json({
      ok: true,
      pageKey,
      path: pageMeta[pageKey].path,
      deployTriggered: deploy.triggered,
      deployWarning: "warning" in deploy ? deploy.warning : undefined,
    });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "Publishing failed.",
      { status: 500 },
    );
  }
}
