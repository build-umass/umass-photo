import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const { data: {user} } = await client.auth.getUser();
  if (!user) return new Response("{}");
  const id = user.id;
  const { data: roleObjectList } = await client
    .from("photoclubuser")
    .select("photoclubrole(*)")
    .eq("id", id);

  // If there is no matching photoclubuser row, or the join is empty,
  // return an empty JSON object instead of throwing.
  if (!roleObjectList || roleObjectList.length === 0) {
    return new Response("{}");
  }

  const [{ photoclubrole: roleData }] = roleObjectList;
  if (!roleData) {
    return new Response("{}");
  }

  const response = new Response(JSON.stringify(roleData));
  return attachCookies(client, response);
}
