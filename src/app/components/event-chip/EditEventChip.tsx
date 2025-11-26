import Image from "next/image"

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
    return <div className="fixed inset-0 bg-black/25 flex items-center justify-center">
        <div className="w-2/3 h-2/3 bg-gray-200 rounded-xl flex flex-col">
            <div className="overflow-hidden relative h-64">
                <Image
                    src="https://placehold.co/600x400.png"
                    alt="placeholder"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-xl"
                ></Image>
            </div>
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