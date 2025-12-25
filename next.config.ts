import type { NextConfig } from "next";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
if (!SUPABASE_URL)
  throw new Error("SUPABASE_URL is not defined in environment variables");
const SUPABASE_HOST_NAME = SUPABASE_URL.split("/")[2];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: SUPABASE_HOST_NAME,
      },
    ],
  },
};

export default nextConfig;
