'use client'
import UmassPhotoButton from "@/app/components/UmassPhotoButton";
import { FormEvent, useRef, useState } from "react";

export default function UploadChip({
    closeCallback
}: {
    closeCallback: () => void
}) {
    const [previewMode, setPreviewMode] = useState(false);
    const imageField = useRef<HTMLInputElement | null>(null);
    const [imageDataURL, setImageDataUrl] = useState("");
    async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/upload-photo', {
            method: 'POST',
            body: formData,
        })
        switch (response.status) {
            case 201:
                closeCallback();
                return;
            default:
                throw Error("Bad Upload!")
        }
    }

    async function processFileLoad() {
        const selectedImage = imageField.current?.files?.item(0)
        if(!selectedImage) return;
        const fr = new FileReader();
        fr.onload = function () {
            if (typeof fr.result !== "string") throw new Error("File was not read as a data URL!")
            setImageDataUrl(fr.result);
        }
        fr.readAsDataURL(selectedImage);

    }

    return <div className="fixed inset-0 flex items-center justify-center bg-black/20">
        <div className="w-2/3 h-2/3 bg-white p-12">
            <div hidden={!previewMode}>
                <img src={imageDataURL}></img>
            </div>
            <form
                onSubmit={uploadPhoto}
                className="flex flex-col gap-4 h-full box-border"
                hidden={previewMode}
            >
                <input type="file" name="image" className="bg-gray-200 p-3 border-2 border-dashed border-gray-600 grow" required ref={imageField} onChange={processFileLoad}></input>
                <input type="text" name="title" className="bg-gray-200 p-3 rounded-xl text-3xl font-bold" placeholder="Title" required></input>
                <textarea name="description" className="bg-gray-200 p-3 rounded-xl grow" placeholder="description" required></textarea>
                <div className="flex flex-row gap-3">
                    {/* TODO convert to common button style */}
                    <UmassPhotoButton className="bg-gray-400" type="button" onClick={closeCallback}>Close</UmassPhotoButton>
                    <div
                        aria-hidden="true"
                        className="grow"
                    ></div>
                    <UmassPhotoButton className="bg-umass-red" type="button" onClick={() => {setPreviewMode(true)}}>Preview</UmassPhotoButton>
                    <UmassPhotoButton className="bg-umass-red" type="submit">Upload</UmassPhotoButton>
                </div>
            </form>
        </div>
    </div>
}