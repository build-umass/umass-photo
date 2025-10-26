import { Tables } from "@/app/utils/supabase/database.types"
import Image from "next/image"

export default function EventChip({
    eventData,
}: {
    eventData: Tables<"event">
}) {
    const startTime = new Date(eventData.startdate)
    const endTime = new Date(eventData.enddate)
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
                <h1 className="text-4xl font-bold p-5 rounded-xl bg-gray-300">{eventData.name}</h1>
                <div className="text-2xl px-5 flex gap-1 items-baseline pt-1 pb-4">
                    <div className="font-bold">Date:</div>
                    <div className="px-5 py-1 rounded-xl bg-gray-300">{startTime.toDateString()}</div>
                    <div>|</div>
                    <div className="px-5 py-1 rounded-xl bg-gray-300">{startTime.toTimeString()}</div>
                    <div>&ndash;</div>
                    <div className="px-5 py-1 rounded-xl bg-gray-300">{endTime.toDateString()}</div>
                    <div>|</div>
                    <div className="px-5 py-1 rounded-xl bg-gray-300">{endTime.toTimeString()}</div>
                </div>
                <div className="text-2xl px-5 py-4 rounded-xl bg-gray-300">
                    {eventData.description}
                </div>
            </div>
            <div className="px-14 py-5 flex justify-between">
                <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-gray-400 text-white">Close</button>
                <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-umass-red text-white">Confirm Changes</button>
            </div>
        </div>
    </div>
}