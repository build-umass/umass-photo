import { Tables } from "@/app/utils/supabase/database.types"
import Image from "next/image"
import ModalCommon from "@/app/components/modal/ModalCommon"
import UmassPhotoButton from "@/app/components/UmassPhotoButton"

export default function ViewEventChip({
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
            <UmassPhotoButton className="bg-gray-400">Close</UmassPhotoButton>
            <div className="grow"></div>
            <UmassPhotoButton className="bg-umass-red">Submit</UmassPhotoButton>
            <UmassPhotoButton className="bg-umass-red">View Gallery</UmassPhotoButton>
        </>
    )

    return (
        <ModalCommon>
            <div className="flex flex-col gap-4 h-full box-border">
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
            </div>
        </ModalCommon>
    )
}
