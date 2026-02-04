"use server";
import { createClient } from "../utils/supabase/server";
import { EventWithURL } from "./types";
import EventMenu from "./EventMenu";

export default async function EventsPage() {
  const client = await createClient();

  const { data: events, error: eventsError } = await client
    .from("event")
    .select("*");

  if (eventsError) {
    console.error("Failed to fetch events:", eventsError);
    return <div>Error loading events.</div>;
  }

  const eventsWithURLs: EventWithURL[] = (events ?? []).map((event) => {
    const herofileURL = client.storage
      .from("photos")
      .getPublicUrl(event.herofile).data.publicUrl;
    return { ...event, herofileURL };
  });

  const loggedIn = (await client.auth.getUser()).data.user !== null;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-umass-red py-16 text-white">
        <div className="container mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold">Upcoming Events</h1>
          <p className="mx-auto max-w-2xl text-xl">
            Join us for exciting photography events, workshops, and exhibitions
          </p>
        </div>
      </section>

      <EventMenu events={eventsWithURLs} loggedIn={loggedIn}></EventMenu>

      {/* CTA Section */}
      <section className="bg-umass-red py-12 text-white">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Have an event idea?</h2>
          <button className="text-umass-red rounded-lg bg-white px-8 py-3 text-lg font-bold transition hover:bg-gray-100">
            Suggest an Event
          </button>
        </div>
      </section>
    </>
  );
}
