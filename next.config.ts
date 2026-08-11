import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only local, statically-authored placeholder SVGs under /public ship
    // through next/image today (no user-uploaded content), so this is safe.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
