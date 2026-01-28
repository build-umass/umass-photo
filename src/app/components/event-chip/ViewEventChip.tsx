"use client";

import { Tables } from "@/app/utils/supabase/database.types";
import Image from "next/image";
import ModalCommon from "@/app/components/ChipLayout";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { formatDate } from "@/app/utils/dates";
import { useRouter } from "next/navigation";
import UmassPhotoButtonGray from "../UmassPhotoButton/UmassPhotoButtonGray";

type EventWithURL = Tables<"event"> & { herofileURL: string };
export default function ViewEventChip({
  eventData,
  onClose,
  loggedIn,
}: {
  eventData: EventWithURL;
  onClose: () => void;
  loggedIn: boolean;
}) {
  const startTime = new Date(eventData.startdate);
  const endTime = new Date(eventData.enddate);
  const router = useRouter();

  return (
    <ModalCommon>
      <div className="box-border flex h-full flex-col gap-4">
        {/* Hero Section */}
        <div className="relative h-48 overflow-hidden rounded-xl">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={eventData.herofileURL}
              alt={`Hero image for ${eventData.name}`}
              fill
              className="rounded-xl object-cover"
            ></Image>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex grow flex-col gap-4 overflow-y-auto">
          <h1 className="text-4xl font-bold">{eventData.name}</h1>

          <div className="text-2xl">
            <b>Date:</b> {formatDate(startTime)} &ndash; {formatDate(endTime)}
          </div>

          <div className="mt-4 overflow-scroll text-2xl">
            {eventData.description}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-wrap justify-between gap-3">
          <UmassPhotoButtonGray onClick={onClose}>Close</UmassPhotoButtonGray>
          <div className="grow"></div>
          {loggedIn && (
            <UmassPhotoButtonRed
              onClick={() => {
                const params = new URLSearchParams({
                  uploadingPhoto: "true",
                  defaultTags: eventData.tag,
                });
                router.push(`/photo-gallery?${params.toString()}`);
              }}
            >
              Submit
            </UmassPhotoButtonRed>
          )}
          <UmassPhotoButtonRed
            onClick={() => {
              const params = new URLSearchParams({
                selectedTags: eventData.tag,
              });
              router.push(`/photo-gallery?${params.toString()}`);
            }}
          >
            View Gallery
          </UmassPhotoButtonRed>
        </div>
      </div>
    </ModalCommon>
  );
}
