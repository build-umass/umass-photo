import { Tables } from "@/app/utils/supabase/database.types"
import Image from "next/image"
import EventChipCommon from "./EventChipCommon"

export default function ViewEventChipFromTemplate({
    eventData,
}: {
    eventData: Tables<"event">
}) {
    const startTime = new Date(eventData.startdate)
    const endTime = new Date(eventData.enddate)

    const heroContent = (
        <div className="overflow-hidden relative h-64">
            <Image
                src="https://placehold.co/600x400.png"
                alt="placeholder"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-xl"
            ></Image>
        </div>
    )

    const headerContent = (
        <h1 className="text-4xl font-bold rounded-xl bg-gray-300">{eventData.name}</h1>
    )

    const timeSection = (
        <>
            <div className="font-bold">Date:</div>
            <div className="px-5 py-1 rounded-xl bg-gray-300">{startTime.toDateString()}</div>
            <div>|</div>
            <div className="px-5 py-1 rounded-xl bg-gray-300">{startTime.toTimeString()}</div>
            <div>&ndash;</div>
            <div className="px-5 py-1 rounded-xl bg-gray-300">{endTime.toDateString()}</div>
            <div>|</div>
            <div className="px-5 py-1 rounded-xl bg-gray-300">{endTime.toTimeString()}</div>
        </>
    )

    const descriptionSection = (
        <div className="text-2xl rounded-xl bg-gray-300">{eventData.description}</div>
    )

    const footerContent = (
        <>
            <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-gray-400 text-white">Close</button>
            <div className="grow"></div>
            <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-umass-red text-white">Submit</button>
            <button className="px-8 py-1 font-bold text-2xl rounded-xl cursor-pointer bg-umass-red text-white">View Gallery</button>
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
