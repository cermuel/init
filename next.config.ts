import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.scdn.co",
      },
      {
        protocol: "https",
        hostname: "*.spotifycdn.com",
      },
    ],
    domains: [
      "mosaic.scdn.co",
      "i.scdn.co",
      "thisis-images.scdn.co",
      "image-cdn-ak.spotifycdn.com",
    ], // 👈 Add this line
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
