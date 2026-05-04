import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "injexifbbvmmhzlefkvd.supabase.co",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
