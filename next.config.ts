import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A build shares `.next` with a running dev server and leaves it serving
  // stale CSS, so build elsewhere: NEXT_DIST_DIR=.next-build pnpm build
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  images: {
    // Sanity's image CDN — required for next/image to serve mainImage.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
};

export default nextConfig;
