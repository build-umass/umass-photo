import type { NextConfig } from "next";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.API_URL;
if (!API_URL)
  throw new Error("API_URL is not defined in environment variables");
const SUPABASE_HOST_NAME = API_URL.split("/")[2];

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
