import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["shared.cloudflare.steamstatic.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shared.cloudflare.steamstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "asset-minio.fleetime.my.id",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
