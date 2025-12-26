import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return new Response("[]");
  const { data: eventList } = await client.from("event").select("*");
  if (!eventList) return new Response("[]");

  const response = new Response(JSON.stringify(eventList));
  return attachCookies(client, response);
}
