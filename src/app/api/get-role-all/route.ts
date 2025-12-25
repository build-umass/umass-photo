import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

 
export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const { data: {user} } = await client.auth.getUser();
  if (!user) return new Response("{}");
  const { data: roleObjectList } = await client.from("photoclubrole").select("*");
  if (!roleObjectList) return new Response("[]");
  const response = new Response(JSON.stringify(roleObjectList));
  return attachCookies(client, response);
}
