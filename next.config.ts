import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["openweathermap.org"],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
