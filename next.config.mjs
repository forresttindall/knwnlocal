import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
