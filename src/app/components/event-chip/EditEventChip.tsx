"use client"
import ImageSelectField from "@/app/components/ImageSelectField"
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
    const heroContent = (
        <ImageSelectField id="event-hero-upload-from-template" name="hero-image" className="w-full h-full"/>
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
