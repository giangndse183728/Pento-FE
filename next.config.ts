import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['openweathermap.org', 'assets.bonappetit.com', 'nononsense.cooking', 'storageelf4ktx3unnz6.blob.core.windows.net'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.bonappetit.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nononsense.cooking',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storageelf4ktx3unnz6.blob.core.windows.net',
        pathname: '/**',
      },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  compiler: {
    styledComponents: true
  }
};

export default nextConfig;
