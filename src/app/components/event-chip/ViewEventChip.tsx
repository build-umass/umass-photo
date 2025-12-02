import { Tables } from "@/app/utils/supabase/database.types"
import Image from "next/image"
import ModalCommon from "@/app/components/ChipLayout"
import UmassPhotoButton from "@/app/components/UmassPhotoButton"

export default function ViewEventChip({
    eventData,
}: {
    eventData: Tables<"event">
}) {
    const startTime = new Date(eventData.startdate)
    const endTime = new Date(eventData.enddate)

    return (
        <ModalCommon>
            <div className="flex flex-col gap-4 h-full box-border">
                {/* Hero Section */}
                <div className="overflow-hidden relative h-48 rounded-xl">
                    <div className="overflow-hidden relative h-64">
                        <Image
                            src="https://placehold.co/600x400.png"
                            alt="placeholder"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-xl"
                        ></Image>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="grow flex flex-col gap-4 overflow-y-auto">
                    <h1 className="text-4xl font-bold">{eventData.name}</h1>

                    <div className="text-2xl">
                        Date: {startTime.toDateString()} | {startTime.toTimeString()}&ndash;{endTime.toDateString()} | {endTime.toTimeString()}
                    </div>

                    <div className="text-2xl overflow-scroll mt-4">{eventData.description}</div>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between gap-3 flex-wrap">
                    <UmassPhotoButton className="bg-gray-400">Close</UmassPhotoButton>
                    <div className="grow"></div>
                    <UmassPhotoButton className="bg-umass-red">Submit</UmassPhotoButton>
                    <UmassPhotoButton className="bg-umass-red">View Gallery</UmassPhotoButton>
                </div>
            </div>
        </ModalCommon>
    )
}
