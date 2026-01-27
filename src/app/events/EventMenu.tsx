"use client";

import { useState } from "react";
import { EventWithURL } from "./types";
import EventItem from "./EventItem";
import ViewEventChip from "../components/event-chip/ViewEventChip";

export default function EventMenu({
  events,
  loggedIn,
}: {
  events: EventWithURL[];
  loggedIn: boolean;
}) {
  const [currentFocusedEvent, setCurrentFocusedEvent] =
    useState<EventWithURL | null>(null);

  return (
    <>
      {/* Events List */}
      <section className="container mx-auto grow px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          {events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              selectEvent={setCurrentFocusedEvent}
            />
          ))}
        </div>
      </section>
      {currentFocusedEvent && (
        <ViewEventChip
          eventData={currentFocusedEvent}
          onClose={() => setCurrentFocusedEvent(null)}
          loggedIn={loggedIn}
        />
      )}
    </>
  );
}
