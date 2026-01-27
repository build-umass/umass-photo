import ModalCommon from "@/app/components/ChipLayout";
import UmassPhotoButton from "@/app/components/UmassPhotoButton/UmassPhotoButton";

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
          <UmassPhotoButton
            className="bg-gray-400 text-white"
            onClick={closeCallback}
            disabled={isDeleting}
          >
            Cancel
          </UmassPhotoButton>
          <UmassPhotoButton
            className={`${!isDeleting ? "bg-umass-red" : "cursor-not-allowed bg-gray-400"} text-white`}
            disabled={isDeleting}
            onClick={onConfirmDelete}
          >
            {isDeleting ? "Deleting..." : "Delete Photo"}
          </UmassPhotoButton>
        </div>
      </div>
    </ModalCommon>
  );
}
