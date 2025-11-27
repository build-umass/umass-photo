"use client"
import Image from "next/image"
import { useRef, useState } from "react"
import EventChipCommon from "./EventChipCommon"

/**
 * Converts a Date object into the datetime-local format
 */
function dateToDateTimeLocalString(date: Date) {
    date = new Date(date);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
}

export default function EditEventChipFromTemplate() {
    const imageField = useRef<HTMLInputElement | null>(null);
    const [imageDataURL, setImageDataUrl] = useState("");
    const [filename, setFilename] = useState("");

    function processFileLoad() {
        const selectedImage = imageField.current?.files?.item(0)
        if (!selectedImage) return;
        const fr = new FileReader();
        fr.onload = function () {
            if (typeof fr.result !== "string") throw new Error("File was not read as a data URL!")
            setImageDataUrl(fr.result);
            setFilename(selectedImage.name);
        }
        fr.readAsDataURL(selectedImage);
    }

    const heroLabelContents = imageDataURL ? (
        <div className="flex flex-col w-full h-full">
            <div className="relative grow">
                <Image
                    src={imageDataURL}
                    alt="selected image preview"
                    fill
                    style={{ objectFit: 'cover' }}
                ></Image>
            </div>
            <div className="text-center text-sm mt-2">{filename}</div>
        </div>
    ) : (
        <div className="w-full h-full flex items-center justify-center text-lg">
            Click to select image
        </div>
    )

    const heroContent = (
        <>
            <input
                type="file"
                accept="image/*"
                id="event-hero-upload-from-template"
                ref={imageField}
                onChange={processFileLoad}
                className="hidden"
            />
            <label htmlFor="event-hero-upload-from-template" className="overflow-hidden relative h-64 cursor-pointer bg-gray-300 rounded-xl p-2 flex items-center justify-center">
                {heroLabelContents}
            </label>
        </>
    )

    const headerContent = (
        <input className="w-full text-4xl font-bold rounded-xl bg-gray-300" />
    )

    const timeSection = (
        <>
            <div className="font-bold">Date:</div>
            <input
                className="px-2 rounded-xl bg-gray-300"
                type="datetime-local"
                id="start-time-input-from-template"
                name="start-time"
                defaultValue={dateToDateTimeLocalString(new Date())}
            />
            <div>&ndash;</div>
            <input
                className="px-2 rounded-xl bg-gray-300"
                type="datetime-local"
                id="end-time-input-from-template"
                name="end-time"
            />
            <div className="text-sm ml-auto">Current Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
        </>
    )

    const descriptionSection = (
        <textarea className="w-full text-2xl rounded-xl bg-gray-300" />
    )

    const footerContent = (
        <>
            <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-gray-400 text-white">Close</button>
            <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-umass-red text-white">Confirm Changes</button>
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
