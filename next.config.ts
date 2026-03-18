import type { NextConfig } from "next";

const TEMPLATE_URL = process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      afterFiles: [

        {
          source: "/assets/:path*",
          destination: `${TEMPLATE_URL}/assets/:path*`,
        },
        {
          source: "/preview/:path*",
          destination: `${TEMPLATE_URL}/preview/:path*`,
        },
        {
          source: "/public/:public_id",
          destination: `${TEMPLATE_URL}/public/:public_id`,
        },
        {
          source: "/invitation/:id",
          destination: `${TEMPLATE_URL}/invitation/:id`,
        },
      ],
    };
  },
};

export default nextConfig;
