"use client";

import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { useEffect, useState } from "react";
import { Tables } from "../utils/supabase/database.types";
import Image from "next/image";
import ViewEventChip from "../components/event-chip/ViewEventChip";

type EventWithURL = Tables<"event"> & { herofileURL: string };
export default function EventsPage() {
  const [events, setEvents] = useState<EventWithURL[]>([]);
  const [currentFocusedEvent, setCurrentFocusedEvent] = useState<EventWithURL | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/get-event-all");
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
    return <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
      {/* Image Block - Left */}
      <div className="w-2/5 h-64 bg-gray-200 flex-shrink-0 relative">
        <Image
          src={event.herofileURL}
          alt={`Hero image for ${event.name}`}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Text Content - Right */}
      <div className="p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-3 text-black">
          {event.name}
        </h2>
        <p className="text-gray-600 mb-4 text-lg">
          {event.enddate}
        </p>
        <p className="mb-6 text-gray-700">
          {event.description}
        </p>
        <button className="bg-[#8E122A] text-white px-6 py-2 rounded-md hover:bg-[#6A0D20] transition w-fit" onClick={() => setCurrentFocusedEvent(event)}>
          Learn More
        </button>
      </div>
    </div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />


      <main className="flex-grow bg-gray-50">
        {/* Hero Section */}
        <section className="bg-[#8E122A] text-white py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Join us for exciting photography events, workshops, and
              exhibitions
            </p>
          </div>
        </section>

        {/* Events List */}
        <section className="container mx-auto py-12 px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {events.map(getEventListingElement)}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#8E122A] text-white py-12">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Have an event idea?</h2>
            <button className="bg-white text-[#8E122A] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-lg">
              Suggest an Event
            </button>
          </div>
        </section>
      </main>
      {currentFocusedEvent && <ViewEventChip eventData={currentFocusedEvent} onClose={() => setCurrentFocusedEvent(null)} />}

      <Footer />
    </div>
  );
}
