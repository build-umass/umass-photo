"use client"
import ImageSelectField from "@/app/components/ImageSelectField"
import EventChipCommon from "./EventChipCommon"
import { useRef, useState } from "react"

/**
 * Converts a Date object into the datetime-local format
 */
function dateToDateTimeLocalString(date: Date) {
    date = new Date(date);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
}

export default function EditEventChipFromTemplate() {
    const [imageDataURL, setImageDataUrl] = useState("");
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
            alert(`${!title} ${!startTime} ${!endTime} ${!description} ${!imageDataURL}`)
            // alert("Please fill in all fields and select an image");
            return;
        }

        try {
            const response = await fetch('/api/create-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                // Event created successfully
                alert("Event created successfully");
                // Reset form
                if (titleRef.current) titleRef.current.value = "";
                if (startTimeRef.current) startTimeRef.current.value = "";
                if (endTimeRef.current) endTimeRef.current.value = "";
                if (descriptionRef.current) descriptionRef.current.value = "";
                setImageDataUrl("");
            } else {
                alert("Failed to create event");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Error creating event");
        }
    }

    const heroContent = (
        <ImageSelectField id="event-hero-upload-from-template" name="hero-image" onImageChange={setImageDataUrl} className="w-full h-full"/>
    )

    const headerContent = (
        <input ref={titleRef} className="w-full text-4xl font-bold rounded-xl bg-gray-300" placeholder="Event Title" />
    )

    const timeSection = (
        <>
            <div className="font-bold">Date:</div>
            <input
                ref={startTimeRef}
                className="px-2 rounded-xl bg-gray-300"
                type="datetime-local"
                id="start-time-input-from-template"
                name="start-time"
                defaultValue={dateToDateTimeLocalString(new Date())}
            />
            <div>&ndash;</div>
            <input
                ref={endTimeRef}
                className="px-2 rounded-xl bg-gray-300"
                type="datetime-local"
                id="end-time-input-from-template"
                name="end-time"
            />
            <div className="text-sm ml-auto">Current Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
        </>
    )

    const descriptionSection = (
        <textarea ref={descriptionRef} className="w-full text-2xl rounded-xl bg-gray-300" placeholder="Event Description" />
    )

    const footerContent = (
        <>
            <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-gray-400 text-white">Close</button>
            <button onClick={handleConfirmChanges} className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-umass-red text-white">Confirm Changes</button>
        </>
    )

    return (
        <EventChipCommon
            heroContent={heroContent}
            headerContent={headerContent}
            timeSection={timeSection}
            descriptionSection={descriptionSection}
            footerContent={footerContent}
        />
    )
}
