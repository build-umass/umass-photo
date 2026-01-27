"use client";

import Image from "next/image";
import { EventWithURL } from "./types";
import { formatDate } from "../utils/dates";

export default function EventItem({
  event,
  selectEvent,
}: {
  event: EventWithURL;
  selectEvent: (event: EventWithURL) => void;
}) {
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
          className="h-full w-full object-cover"
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
          onClick={() => selectEvent(event)}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
