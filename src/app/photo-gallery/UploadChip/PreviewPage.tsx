import UmassPhotoButton from "@/app/components/UmassPhotoButton"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

export default function PreviewPage({
    previewImageUrl,
    setPreviewMode,
}: {
    previewImageUrl: string
    setPreviewMode: Dispatch<SetStateAction<boolean>>
}) {
    const imageDiv = previewImageUrl ?
        <Image className="object-contain" alt="Preview for Uploaded Image" src={previewImageUrl} fill={true}></Image> :
        <div>No image selected!</div>;

    return <div className="w-full h-full flex flex-col">
        <div className="relative grow">
            {imageDiv}
        </div>
        <div className="flex justify-end pt-3">
            <UmassPhotoButton className="bg-umass-red" type="button" onClick={() => { setPreviewMode(previewMode => !previewMode) }}>Close Preview</UmassPhotoButton>
        </div>
    </div>
}