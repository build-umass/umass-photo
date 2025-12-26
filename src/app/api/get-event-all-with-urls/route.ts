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
