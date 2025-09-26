import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/media/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/media/**' },
      { protocol: 'https', hostname: 'altivomart.com', pathname: '/media/**' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react'
    ],
  },
  // Allow external API calls
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
