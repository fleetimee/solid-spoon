import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "119.28.113.203",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
