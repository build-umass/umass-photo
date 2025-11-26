'use client'
import Image from "next/image"
import { useRef, useState } from "react"

/**
 * Converts a Date object into the [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats#local_date_and_time_strings) format
 * @param date the date to be converted.
 */
function dateToDateTimeLocalString(date: Date) {
    // Source - https://stackoverflow.com/a/61082536
    // Posted by neurino, modified by community. See post 'Timeline' for change history
    // Retrieved 2025-11-25, License - CC BY-SA 4.0
    date = new Date(date);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
}

export default function EditEventChip() {
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
    return <div className="fixed inset-0 bg-black/25 flex items-center justify-center">
        <div className="w-2/3 h-2/3 bg-gray-200 rounded-xl flex flex-col">
            <input
                type="file"
                accept="image/*"
                id="event-hero-upload"
                ref={imageField}
                onChange={processFileLoad}
                className="hidden"
            />
            <label htmlFor="event-hero-upload" className="overflow-hidden relative h-64 cursor-pointer bg-gray-300 rounded-xl p-2 flex items-center justify-center">
                {heroLabelContents}
            </label>
            <div className="grow p-9 flex flex-col">
                <input className="text-4xl font-bold p-5 rounded-xl bg-gray-300"></input>
                <div className="text-2xl px-5 flex gap-1 items-center pt-1 pb-4">
                    <div className="font-bold">
                        Date:
                    </div>
                    <input
                        className="px-2 rounded-xl bg-gray-300"
                        type="datetime-local"
                        id="start-time-input"
                        name="start-time"
                        defaultValue={dateToDateTimeLocalString(new Date())}
                    />
                    <div>
                        &ndash;
                    </div>
                    <input
                        className="px-2 rounded-xl bg-gray-300"
                        type="datetime-local"
                        id="end-time-input"
                        name="end-time"
                    />
                    <div className="text-sm ml-auto">
                        Current Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </div>
                </div>
                <textarea className="text-2xl px-5 py-4 rounded-xl bg-gray-300"></textarea>
            </div>
            <div className="px-14 py-5 flex justify-between">
                <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-gray-400 text-white">Close</button>
                <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-umass-red text-white">Confirm Changes</button>
            </div>
        </div>
    </div>
}