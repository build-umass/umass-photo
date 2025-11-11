'use client'
import UmassPhotoButton from "@/app/components/UmassPhotoButton";
import { FormEvent } from "react";

export default function UploadChip({
    closeCallback
}: {
    closeCallback: () => void
}) {
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

    return <div className="fixed inset-0 flex items-center justify-center bg-black/20">
        <div className="w-2/3 h-2/3 bg-white p-12">
            <form
                onSubmit={uploadPhoto}
                className="flex flex-col gap-4 h-full box-border"
            >
                <input type="file" name="image" className="bg-gray-200 p-3 border-2 border-dashed border-gray-600 grow"></input>
                <input type="text" name="title" className="bg-gray-200 p-3 rounded-xl text-3xl font-bold" placeholder="Title"></input>
                <textarea name="description" className="bg-gray-200 p-3 rounded-xl grow" placeholder="description"></textarea>
                <div className="flex flex-row gap-3">
                    {/* TODO convert to common button style */}
                    <UmassPhotoButton className="bg-gray-400" onClick={closeCallback}>Close</UmassPhotoButton>
                    <div
                        aria-hidden="true"
                        className="grow"
                    ></div>
                    <UmassPhotoButton className="bg-umass-red">Preview</UmassPhotoButton>
                    <UmassPhotoButton className="bg-umass-red" type="submit">Upload</UmassPhotoButton>
                </div>
            </form>
        </div>
    </div>
}