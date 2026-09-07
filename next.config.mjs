import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

{
  const pid = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
  const ds = (process.env.NEXT_PUBLIC_SANITY_DATASET || "").trim();
  const tok = (process.env.SANITY_API_TOKEN || "").trim();

  const isVercelBuild =
    (process.env.VERCEL && String(process.env.VERCEL) !== "0") ||
    (process.env.CI && String(process.env.CI) !== "0") ||
    String(process.env.NEXT_PUBLIC_VERCEL_ENV || "") === "production";

  const issues = [];

  if (!pid) issues.push("NEXT_PUBLIC_SANITY_PROJECT_ID is EMPTY.");
  if (pid && !/^[a-z0-9]{6,12}$/i.test(pid)) {
    issues.push(
      `NEXT_PUBLIC_SANITY_PROJECT_ID is malformed. Got: "${pid}" (len=${pid.length}). Expected a 6-12 char alphanumeric Sanity project ID (e.g. q8pm75vw). If you set it to the WORD "true" (a classic Vercel env-var mispaste), delete the variable and recreate it.`,
    );
  }
  if (!ds) issues.push("NEXT_PUBLIC_SANITY_DATASET is EMPTY.");
  if (ds && /[^a-z0-9_\-]/i.test(ds)) {
    issues.push(
      `NEXT_PUBLIC_SANITY_DATASET is malformed. Got: "${ds}". Dataset names must match [a-zA-Z0-9_-].`,
    );
  }
  if (!tok) issues.push("SANITY_API_TOKEN is EMPTY (server-only). Write operations will fail.");
  if (tok) {
    const lenOk = tok.length >= 40 && tok.length <= 300;
    const prefixOk = /^sk[A-Za-z0-9]/.test(tok);
    if (!lenOk || !prefixOk) {
      issues.push(
        `SANITY_API_TOKEN looks wrong. Len=${tok.length}, starts=${tok.slice(0, 3)}. Expected ${tok.length > 1 ? '40-300' : ''} chars beginning with "sk" (Sanity Editor token). If empty DELETE the variable in Vercel and recreate cleanly.`,
      );
    }
  }

  if (issues.length > 0) {
    const banner = "=".repeat(72);
    const head = isVercelBuild
      ? `BUILD HALTED — Sanity env vars are misconfigured. The site would ship broken.\n\nFix these in Vercel → Project → Settings → Environment Variables,\nthen click Redeploy on the latest build (do NOT just git push).`
      : `WARNING — Sanity env vars are misconfigured. Local build is continuing,\nbut Vercel/CI production builds will FAIL until these are fixed.`;
    const msg =
      `\n${banner}\n` +
      head +
      `\n\n` +
      issues.map((s, i) => `  [${i + 1}] ${s}`).join("\n") +
      `\n\nIf running locally: check your .env or .env.local files.\n` +
      `${banner}\n`;
    console.error(msg);
    if (isVercelBuild) {
      throw new Error(msg);
    }
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  webpack: (config) => {
    config.snapshot = config.snapshot || {};
    config.snapshot.managedPaths = config.snapshot.managedPaths || [];
    const projectNodeModules = path.join(__dirname, "node_modules");
    if (!config.snapshot.managedPaths.includes(projectNodeModules)) {
      config.snapshot.managedPaths.push(projectNodeModules);
    }
    // Exclude parent-level node_modules that are interfering with page resolution
    config.snapshot.managedPaths = config.snapshot.managedPaths.filter(
      (p) => !/^\/Users\/[^/]+\/node_modules(\/|$)/.test(String(p)),
    );
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  async headers() {
    if (process.env.NODE_ENV === "development") {
      return [];
    }
    return [
      {
        source: "/_next/static/css/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Vary", value: "Accept-Encoding" },
        ],
      },
    ];
  },
};

export default nextConfig;
