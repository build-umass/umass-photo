import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function PreviewPage({
  previewImageUrl,
  setPreviewMode,
}: {
  previewImageUrl: string;
  setPreviewMode: Dispatch<SetStateAction<boolean>>;
}) {
  const imageDiv = previewImageUrl ? (
    <Image
      className="object-contain"
      alt="Preview for Uploaded Image"
      src={previewImageUrl}
      fill={true}
    ></Image>
  ) : (
    <div>No image selected!</div>
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative grow">{imageDiv}</div>
      <div className="flex justify-end pt-3">
        <UmassPhotoButtonRed
          onClick={() => {
            setPreviewMode((previewMode) => !previewMode);
          }}
          type="button"
        >
          Close Preview
        </UmassPhotoButtonRed>
      </div>
    </div>
  );
}
