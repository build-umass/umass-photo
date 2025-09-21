import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const { data: userData } = await client.auth.getUser();
  const id = userData.user?.id;
  const { data: roleObjectList } = await client.from("photoclubuser").select("photoclubrole(*)").eq("id", id);
  if (!roleObjectList) return;
  const [{ photoclubrole: roleData }] = roleObjectList
  const response = new Response(JSON.stringify(roleData));
  return attachCookies(client, response);
}
