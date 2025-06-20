import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
  },
  // Ensure environment variables are available at build time
  experimental: {
    // This ensures env vars are embedded in the build
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
