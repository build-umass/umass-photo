"use server";

import { createClient } from "@/app/utils/supabase/server";
import EventEditor from "./EventEditor";

export default async function EventsPage() {
  const client = await createClient();
  const { data: eventData, error: eventError } = await client
    .from("event")
    .select("*");

  if (eventError) {
    throw new Error(eventError.message);
  }

  const eventDataRecord = Object.fromEntries(
    (eventData ?? []).map((event) => [event.id, event]),
  );

  return <EventEditor initialEventData={eventDataRecord}></EventEditor>;
}
