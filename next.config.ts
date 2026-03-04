import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/@vite/:path*",
          destination: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/@vite/:path*`,
        },
        {
          source: "/src/:path*",
          destination: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/src/:path*`,
        },
        {
          source: "/node_modules/:path*",
          destination: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/node_modules/:path*`,
        },
        {
          source: "/assets/:path*",
          destination: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/assets/:path*`,
        },
        {
          source: "/:slug",
          destination: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/:slug`,
        },
        {
          source: "/public/:public_id",
          destination: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/public/:public_id`,
        },
      ],
    };
  },
};

export default nextConfig;
