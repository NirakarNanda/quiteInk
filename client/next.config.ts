import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/journals/:path*',
        destination: 'http://localhost:5000/api/journals/:path*',
      },
    ]
  },
};

export default nextConfig;
