import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const { data: eventList, error: selectEventError } = await client.from("event").select("*");
  if (selectEventError) {
    return new Response(JSON.stringify({
      message: "Failed to fetch events",
      error: selectEventError,
    }), { status: 500 });
  }

  // Transform the data and get image URLs
  const eventListWithURLs = eventList.map((event) => {
    // Get public URL for the image
    const imageUrl = client.storage.from("photos").getPublicUrl(event.herofile)
      .data.publicUrl;

    return {
      ...event,
      herofileURL: imageUrl,
    };
  });
  const response = new Response(JSON.stringify(eventListWithURLs));
  return attachCookies(client, response);
}
