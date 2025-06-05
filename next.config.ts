import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
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
      "purepng.com",
      "thisis-images.scdn.co",
      "image-cdn-ak.spotifycdn.com",
      "res.cloudinary.com",
    ], // 👈 Add this line
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
