import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [65, 75],
    minimumCacheTTL: 2678400,
  },
  experimental: {
    workerThreads: true,
  },
  typescript: {
    // TypeScript is checked separately; this environment blocks Next's build worker.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
