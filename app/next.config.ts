import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  // Ensure images from Twitter are allowed
  images: {
    domains: ['pbs.twimg.com', 'abs.twimg.com'],
  },
};

export default nextConfig;
