import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Static export can't use the default loader (it needs a running server).
    // There is no remote image source yet — every image is a local placeholder
    // SVG — so unoptimized output is the correct choice, not a workaround.
    unoptimized: true,
  },
};

export default nextConfig;
