import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://lotto-data-lab.duckdns.org/api/:path*"
            : "http://localhost:4000/api/:path*", // 로컬 Express 포트
      },
    ];
  },
};

export default nextConfig;
