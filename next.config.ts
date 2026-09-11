import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Was `output: "export"` — a pure static export can't run what /dashboard
  // needs (a server to check a password against, hold a signed session
  // cookie, or persist a content save). Deploy this to a Node-capable host
  // (Vercel, etc.) from here on, not plain static file hosting.
  images: {
    // No remote image source; uploaded content images are user photos of
    // unknown/unbounded dimensions the built-in optimizer isn't meant for.
    unoptimized: true,
  },
};

export default nextConfig;
