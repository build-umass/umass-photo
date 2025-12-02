"use client"
import ImageSelectField from "@/app/components/ImageSelectField"
import ModalCommon from "@/app/components/modal/ModalCommon"
import UmassPhotoButton from "@/app/components/UmassPhotoButton"
import { useRef, useState } from "react"

/**
 * Converts a Date object into the datetime-local format
 */
function dateToDateTimeLocalString(date: Date) {
    date = new Date(date);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
}

export default function EditEventChip({
    closeCallback
}: {
    closeCallback: () => void
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
            if (!title) setValidationErrorMessage("Missing Title!")
            if (!startTime) setValidationErrorMessage("Select a start time!")
            if (!endTime) setValidationErrorMessage("Select an end time!")
            if (!description) setValidationErrorMessage("Create a description!")
            if (!imageDataURL) setValidationErrorMessage("Select a banner image!")
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
                closeCallback()
            } else if (response.status === 401) {
                setValidationErrorMessage("Please login and try again");
                window.open("/login", "_blank");
            } else if (response.status === 400) {
                setValidationErrorMessage("Bad input");
            } else {
                setValidationErrorMessage("We are experiencing internal issues. Please try again.");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Error creating event");
        }
    }

    const heroContent = (
        <ImageSelectField id="event-hero-upload-from-template" name="hero-image" onImageChange={setImageDataUrl} className="w-full h-full" />
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
            <UmassPhotoButton className="bg-gray-400" onClick={closeCallback}>Close</UmassPhotoButton>
            {validationErrorMessage ?
                <div className="text-umass-red">{validationErrorMessage}</div> :
                <></>}
            <UmassPhotoButton className="bg-umass-red" onClick={handleConfirmChanges}>Confirm Changes</UmassPhotoButton>
        </>
    )

    return (
        <ModalCommon>
            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    await handleConfirmChanges()
                }}
                className="flex flex-col gap-4 h-full box-border"
            >
                {/* Hero Section */}
                <div className="overflow-hidden relative h-48 rounded-xl">
                    {heroContent}
                </div>

                {/* Main Content Section */}
                <div className="grow flex flex-col gap-4 overflow-y-auto">
                    <div className="text-4xl font-bold p-5 rounded-xl bg-gray-300">
                        {headerContent}
                    </div>

                    <div className="text-2xl px-5 flex gap-1 items-center">
                        {timeSection}
                    </div>

                    <div className="text-2xl px-5 py-4 rounded-xl bg-gray-300">
                        {descriptionSection}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between gap-3 flex-wrap">
                    {footerContent}
                </div>
            </form>
        </ModalCommon>
    )
}
