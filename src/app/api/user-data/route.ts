import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const { data: userData } = await client.auth.getUser();
  const response = new Response(JSON.stringify(userData));
  return attachCookies(client, response);
}
