'use client'
import { FormEvent } from "react";
import { useFormStatus } from "react-dom";

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
                <div className="flex flex-row">
                    {/* TODO convert to common button style */}
                    <button onClick={closeCallback}>Close</button>
                    <button>Preview</button>
                    <button type="submit">Upload</button>
                </div>
            </form>
        </div>
    </div>
}