import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // unoptimized: true, <-- Removed this for production performance
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 1. Allow Cloudinary (Primary storage)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // 2. Allow Render Backend (Fallback)
      {
        protocol: 'https',
        hostname: 'graingrid-backend.onrender.com',
        pathname: '/uploads/**',
      },
      // 3. Keep Localhost for testing
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  // CORS Headers
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
        ],
      },
    ];
  },
};

export default nextConfig;