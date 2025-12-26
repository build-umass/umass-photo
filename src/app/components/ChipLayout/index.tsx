import { ReactNode } from "react";

/**
 * Unified modal container following UploadChip's layout format
 * Features:
 * - Fixed overlay with semi-transparent black background
 * - White modal with standard padding
 * - Flexible content structure for various use cases
 */
export default function ModalCommon({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/20">
      <div className="flex h-2/3 w-2/3 flex-col rounded-xl bg-white p-12">
        {children}
      </div>
    </div>
  );
}
