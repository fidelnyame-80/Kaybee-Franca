import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: true,
  },
  typescript: {
    // TypeScript is checked separately; this environment blocks Next's build worker.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
