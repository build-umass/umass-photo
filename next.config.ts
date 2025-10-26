import type { NextConfig } from "next";
import dotenv from "dotenv"
dotenv.config()

const SUPABASE_HOST_NAME = process.env.SUPABASE_URL?.split("/")[2]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: SUPABASE_HOST_NAME!
      },
      {
        hostname: "placehold.co"
      },
    ]
  }
};

export default nextConfig;
