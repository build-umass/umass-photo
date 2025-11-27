import { ReactNode } from "react"

export default function EventChipCommon({
    heroContent,
    headerContent,
    timeSection,
    descriptionSection,
    footerContent,
}: {
    heroContent: ReactNode
    headerContent: ReactNode
    timeSection: ReactNode
    descriptionSection: ReactNode
    footerContent: ReactNode
}) {
    return (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center">
            <div className="w-2/3 h-2/3 bg-gray-200 rounded-xl flex flex-col">
                {/* Hero Section */}
                <div className="overflow-hidden relative h-64">
                    {heroContent}
                </div>

                {/* Main Content Section */}
                <div className="grow p-9 flex flex-col">
                    <div className="text-4xl font-bold p-5 rounded-xl bg-gray-300">
                        {headerContent}
                    </div>

                    <div className="text-2xl px-5 flex gap-1 items-center pt-1 pb-4">
                        {timeSection}
                    </div>

                    <div className="text-2xl px-5 py-4 rounded-xl bg-gray-300">
                        {descriptionSection}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-14 py-5 flex justify-between gap-2">
                    {footerContent}
                </div>
            </div>
        </div>
    )
}
