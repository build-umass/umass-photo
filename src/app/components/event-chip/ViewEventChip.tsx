import { Tables } from "@/app/utils/supabase/database.types"
import Image from "next/image"
import ModalCommon from "@/app/components/ChipLayout"
import UmassPhotoButton from "@/app/components/UmassPhotoButton"
import { formatDate } from "@/app/utils/dates";

type EventWithURL = Tables<"event"> & { herofileURL: string };
export default function ViewEventChip({
    eventData,
    onClose,
}: {
    eventData: EventWithURL
    onClose: () => void
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
                            src={eventData.herofileURL}
                            alt={`Hero image for ${eventData.name}`}
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
                        <b>Date:</b> {formatDate(startTime)} &ndash; {formatDate(endTime)}
                    </div>

                    <div className="text-2xl overflow-scroll mt-4">{eventData.description}</div>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between gap-3 flex-wrap">
                    <UmassPhotoButton className="bg-gray-400" onClick={onClose}>Close</UmassPhotoButton>
                    <div className="grow"></div>
                    <UmassPhotoButton className="bg-umass-red">Submit</UmassPhotoButton>
                    <UmassPhotoButton className="bg-umass-red">View Gallery</UmassPhotoButton>
                </div>
            </div>
        </ModalCommon>
    )
}
