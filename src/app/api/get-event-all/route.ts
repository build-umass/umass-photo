import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const { data: eventList, error: selectEventError } = await client
    .from("event")
    .select("*");
  if (selectEventError) {
    return new Response(
      JSON.stringify({
        message: "Failed to fetch events",
        error: selectEventError,
      }),
      { status: 500 },
    );
  }

  const response = new Response(JSON.stringify(eventList));
  return attachCookies(client, response);
}
