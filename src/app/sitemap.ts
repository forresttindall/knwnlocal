import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://knwnlocal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastmod = now.toISOString();

  const routes = [
    { path: "/", priority: 1.0, changeFreq: "weekly" as const },
    { path: "/youtube", priority: 0.95, changeFreq: "weekly" as const },
    { path: "/email", priority: 0.95, changeFreq: "weekly" as const },
    { path: "/podcast", priority: 0.8, changeFreq: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: lastmod,
    changeFrequency: r.changeFreq,
    priority: r.priority,
  }));
}
