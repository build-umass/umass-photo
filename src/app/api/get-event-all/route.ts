import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const client = await createClient();

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
  return response;
}
