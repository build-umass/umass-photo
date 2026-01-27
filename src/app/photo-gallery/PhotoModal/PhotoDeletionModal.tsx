import ModalCommon from "@/app/components/ChipLayout";
import UmassPhotoButtonGray from "@/app/components/UmassPhotoButton/UmassPhotoButtonGray";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";

export default function PhotoDeletionModal({
  closeCallback,
  photoTitle,
  onConfirmDelete,
  isDeleting,
}: {
  closeCallback: () => void;
  photoTitle: string;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <ModalCommon>
      <div className="z-20 flex h-full flex-col items-center justify-center">
        <h2 className="mb-6 text-4xl font-bold">
          Are you sure you want to delete this photo?
        </h2>
        <p className="mb-8 text-center text-2xl">
          This action is irreversible and will permanently remove{" "}
          <span className="font-bold">&quot;{photoTitle}&quot;</span> from the
          gallery.
        </p>
        <div className="flex gap-4">
          <UmassPhotoButtonGray onClick={closeCallback} disabled={isDeleting}>
            Cancel
          </UmassPhotoButtonGray>
          <UmassPhotoButtonRed disabled={isDeleting} onClick={onConfirmDelete}>
            {isDeleting ? "Deleting..." : "Delete Photo"}
          </UmassPhotoButtonRed>
        </div>
      </div>
    </ModalCommon>
  );
}
