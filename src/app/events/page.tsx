"use client";

import { useEffect, useState } from "react";
import { Tables } from "../utils/supabase/database.types";
import Image from "next/image";
import ViewEventChip from "../components/event-chip/ViewEventChip";
import { formatDate } from "../utils/dates";

type EventWithURL = Tables<"event"> & { herofileURL: string };
export default function EventsPage() {
  const [events, setEvents] = useState<EventWithURL[]>([]);
  const [currentFocusedEvent, setCurrentFocusedEvent] =
    useState<EventWithURL | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/get-event-all-with-urls");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);

  function getEventListingElement(event: EventWithURL) {
    const endDate = new Date(event.enddate);
    return (
      <div
        key={event.id}
        className="flex overflow-hidden rounded-lg bg-white shadow-md"
      >
        {/* Image Block - Left */}
        <div className="relative h-64 w-2/5 shrink-0 bg-gray-200">
          <Image
            src={event.herofileURL}
            alt={`Hero image for ${event.name}`}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </div>

        {/* Text Content - Right */}
        <div className="flex flex-col justify-center p-8">
          <h2 className="mb-3 text-2xl font-bold text-black">{event.name}</h2>
          <p className="mb-4 text-lg text-gray-600">{formatDate(endDate)}</p>
          <p className="mb-6 text-gray-700">{event.description}</p>
          <button
            className="cursor-camera bg-umass-red w-fit rounded-md px-6 py-2 text-white transition hover:bg-[#6A0D20]"
            onClick={() => setCurrentFocusedEvent(event)}
          >
            Learn More
          </button>
        </div>
      </div>
    );
  }

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

      {/* Events List */}
      <section className="container mx-auto grow px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          {events.map(getEventListingElement)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-umass-red py-12 text-white">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Have an event idea?</h2>
          <button className="text-umass-red rounded-lg bg-white px-8 py-3 text-lg font-bold transition hover:bg-gray-100">
            Suggest an Event
          </button>
        </div>
      </section>
      {currentFocusedEvent && (
        <ViewEventChip
          eventData={currentFocusedEvent}
          onClose={() => setCurrentFocusedEvent(null)}
        />
      )}
    </>
  );
}
