import type { NextConfig } from "next";
import dotenv from "dotenv";
import { RemotePattern } from "next/dist/shared/lib/image-config";
dotenv.config();

const apiUrlString = process.env.API_URL || process.env.SUPABASE_URL;
if (!apiUrlString)
  throw new Error("API_URL is not defined in environment variables");
const apiUrl = new URL(apiUrlString);
const apiUrlProtocol = apiUrl.protocol;
if (apiUrlProtocol !== "http:" && apiUrlProtocol !== "https:")
  throw new Error("API_URL must start with http:// or https://");
const apiUrlPattern: RemotePattern = {
  protocol: apiUrl.protocol.slice(0, -1) as "http" | "https",
  hostname: apiUrl.hostname,
  port: apiUrl.port,
};

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      apiUrlPattern,
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
