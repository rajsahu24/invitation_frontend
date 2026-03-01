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
          source: "/:public_id",
          destination: `${process.env.NEXT_PUBLIC_TEMPLATE_APIGATEWAY_URL}/:public_id`,
        },
      ],
    };
  },
};

export default nextConfig;
