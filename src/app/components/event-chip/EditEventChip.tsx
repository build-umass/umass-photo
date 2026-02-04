"use client";
import ImageSelectField from "@/app/components/ImageSelectField";
import ModalCommon from "@/app/components/ChipLayout";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { useRef, useState } from "react";
import UmassPhotoButtonGray from "../UmassPhotoButton/UmassPhotoButtonGray";

/**
 * Converts a Date object into the datetime-local format
 */
function dateToDateTimeLocalString(date: Date) {
  date = new Date(date);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function EditEventChip({
  closeCallback,
}: {
  closeCallback: () => void;
}) {
  const [imageDataURL, setImageDataUrl] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  async function handleConfirmChanges() {
    const title = titleRef.current?.value;
    const startTime = startTimeRef.current?.value;
    const endTime = endTimeRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title || !startTime || !endTime || !description || !imageDataURL) {
      if (!title) setValidationErrorMessage("Missing Title!");
      if (!startTime) setValidationErrorMessage("Select a start time!");
      if (!endTime) setValidationErrorMessage("Select an end time!");
      if (!description) setValidationErrorMessage("Create a description!");
      if (!imageDataURL) setValidationErrorMessage("Select a banner image!");
      return;
    }

    try {
      const response = await fetch("/api/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          startTime,
          endTime,
          description,
          imageDataURL,
        }),
      });

      if (response.status === 201) {
        closeCallback();
      } else if (response.status === 401) {
        setValidationErrorMessage("Please login and try again");
        window.open("/login", "_blank");
      } else if (response.status === 400) {
        setValidationErrorMessage("Bad input");
      } else {
        setValidationErrorMessage(
          "We are experiencing internal issues. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    }
  }

  const heroContent = (
    <ImageSelectField
      id="event-hero-upload-from-template"
      name="hero-image"
      onImageChange={setImageDataUrl}
      className="h-full w-full"
    />
  );

  const headerContent = (
    <input
      ref={titleRef}
      className="w-full rounded-xl bg-gray-200 text-4xl font-bold"
      placeholder="Event Title"
    />
  );

  const timeSection = (
    <>
      <div className="font-bold">Date:</div>
      <input
        ref={startTimeRef}
        className="rounded-xl bg-gray-200 px-2"
        type="datetime-local"
        id="start-time-input-from-template"
        name="start-time"
        defaultValue={dateToDateTimeLocalString(new Date())}
      />
      <div>&ndash;</div>
      <input
        ref={endTimeRef}
        className="rounded-xl bg-gray-200 px-2"
        type="datetime-local"
        id="end-time-input-from-template"
        name="end-time"
      />
      <div className="ml-auto text-sm">
        Current Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </div>
    </>
  );

  const descriptionSection = (
    <textarea
      ref={descriptionRef}
      className="w-full rounded-xl bg-gray-200 text-2xl"
      placeholder="Event Description"
    />
  );

  const footerContent = (
    <>
      <UmassPhotoButtonGray onClick={closeCallback}>Close</UmassPhotoButtonGray>
      {validationErrorMessage ? (
        <div className="text-umass-red">{validationErrorMessage}</div>
      ) : (
        <></>
      )}
      <UmassPhotoButtonRed onClick={handleConfirmChanges}>
        Confirm Changes
      </UmassPhotoButtonRed>
    </>
  );

  return (
    <ModalCommon>
      <div className="box-border flex h-full flex-col gap-4">
        {/* Hero Section */}
        <div className="relative h-48 overflow-hidden rounded-xl">
          {heroContent}
        </div>

        {/* Main Content Section */}
        <div className="flex grow flex-col gap-4 overflow-y-auto">
          <div className="rounded-xl bg-gray-200 p-5 text-4xl font-bold">
            {headerContent}
          </div>

          <div className="flex items-center gap-1 px-5 text-2xl">
            {timeSection}
          </div>

          <div className="rounded-xl bg-gray-200 px-5 py-4 text-2xl">
            {descriptionSection}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-wrap justify-between gap-3">
          {footerContent}
        </div>
      </div>
    </ModalCommon>
  );
}
