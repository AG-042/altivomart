import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/media/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      { protocol: 'https', hostname: 'altivomart.com', pathname: '/media/**' },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react'
    ],
  },
};

export default nextConfig;
