import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Performance ───────────────────────────────────────────────────────────
  reactStrictMode: true,

  // ─── Image Optimization ────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // ─── Headers for Security & Caching ────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/:path*.(js|css|woff2|ico|svg|png|jpg|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
