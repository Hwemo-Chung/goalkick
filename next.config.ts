import type { NextConfig } from "next";

const withPWA = (config: NextConfig): NextConfig => {
  return {
    ...config,
    headers: async () => [
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
    ],
  };
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "**.api-football.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default withPWA(nextConfig);
