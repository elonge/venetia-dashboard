import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/venetia-stanley-edwin-montagu",
        destination: "/venetia-stanley-edwin-montagu-marriage",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
