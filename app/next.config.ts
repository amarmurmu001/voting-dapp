import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'pino-pretty': false,
      };
    }
    return config;
  },
  // Ensure images from Twitter are allowed
  images: {
    domains: ['pbs.twimg.com', 'abs.twimg.com'],
  },
};

export default config;
