import { ReactNode } from "react"

/**
 * Unified modal container following UploadChip's layout format
 * Features:
 * - Fixed overlay with semi-transparent black background
 * - White modal with standard padding
 * - Flexible content structure for various use cases
 */
export default function ModalCommon({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="w-2/3 h-2/3 bg-white p-12 rounded-xl flex flex-col">
                {children}
            </div>
        </div>
    )
}
