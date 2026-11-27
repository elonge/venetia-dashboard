import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "thevenetiaproject.com" }],
        destination: "https://www.thevenetiaproject.com/:path*",
        permanent: true,
      },
      {
        source: "/venetia-stanley-edwin-montagu",
        destination: "/venetia-stanley-edwin-montagu-marriage",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
