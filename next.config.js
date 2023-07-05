/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: ["cdn.sanity.io", "https://"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // exclude server-only modules from client-side bundle
      config.resolve.fallback.fs = false;
    }

    return config;
  },
};

module.exports = nextConfig;
