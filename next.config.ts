import type { NextConfig } from "next";

// STATIC_PREVIEW=1 produces a static export for the shareable preview.
// Normal builds (and Vercel) use the full server so the contact API works.
const preview = process.env.STATIC_PREVIEW === "1";

const nextConfig: NextConfig = {
  // Cache Components is not compatible with a static export, so the preview turns it off.
  cacheComponents: !preview,
  partialPrefetching: !preview,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: { unoptimized: preview },
  env: { NEXT_PUBLIC_STATIC_PREVIEW: preview ? "1" : "0" },
  ...(preview ? { output: "export" as const, assetPrefix: "." } : {}),
};

export default nextConfig;
