import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "appleshop.ap43.ru",
        port: "",
        pathname: "/api/telegram/file/**",
      },
    ],
  },
};

export default nextConfig;
