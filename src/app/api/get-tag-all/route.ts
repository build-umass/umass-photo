import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const { data: tagObjectList } = await client.from("tag").select("*");
  if (!tagObjectList) return new Response("[]");
  const tagList = tagObjectList.map(({name}) => name);
  const response = new Response(JSON.stringify(tagList));
  return attachCookies(client, response);
}
