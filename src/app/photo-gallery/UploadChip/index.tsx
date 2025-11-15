'use client'
import UmassPhotoButton from "@/app/components/UmassPhotoButton";
import { FormEvent, useEffect, useRef, useState } from "react";
import PreviewPage from "./PreviewPage";

export default function UploadChip({
    closeCallback
}: {
    closeCallback: () => void
}) {
    const [previewMode, setPreviewMode] = useState(false);
    const imageField = useRef<HTMLInputElement | null>(null);
    const [imageDataURL, setImageDataUrl] = useState("");
    const [tagOptions, setTagOptions] = useState<Set<string>>(new Set())
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    async function refreshTagList() {
        const response = await fetch('/api/get-tag-all', {
            method: 'GET',
        })
        const tags = new Set(await response.json() as string[]);
        setTagOptions(tags);
    }

    async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        formData.set("tags", JSON.stringify(selectedTags))
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

    function addTag(tag: string) {
        setSelectedTags((selectedTags) => {
            if (selectedTags.includes(tag)) {
                return selectedTags
            } else {
                return [...selectedTags, tag]
            }
        });
    }

    function removeTag(tagToRemove: string) {
        setSelectedTags((selectedTags) => {
            return selectedTags.filter(tag => tag !== tagToRemove);
        });
    }

    useEffect(() => {
        refreshTagList()
    }, []);


    async function processFileLoad() {
        const selectedImage = imageField.current?.files?.item(0)
        if (!selectedImage) return;
        const fr = new FileReader();
        fr.onload = function () {
            if (typeof fr.result !== "string") throw new Error("File was not read as a data URL!")
            setImageDataUrl(fr.result);
        }
        fr.readAsDataURL(selectedImage);
    }

    const tagList = selectedTags.map(tag => <div key={tag} className="bg-gray-300 rounded-xl py-1 px-4 text-2xl">{tag}
        <button type="button" onClick={() => { removeTag(tag) }}>X</button>
    </div>)

    const tagOptionElements = Array.from(tagOptions).map(tag => <option key={tag} value={tag}>{tag}</option>)

    return <div className="fixed inset-0 flex items-center justify-center bg-black/20">
        <div className="w-2/3 h-2/3 bg-white p-12">
            <div className="w-full h-full" hidden={!previewMode}>
                <PreviewPage previewImageUrl={imageDataURL} setPreviewMode={setPreviewMode}></PreviewPage>
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
                    {tagList}
                    <select defaultValue="default" className="bg-gray-300 rounded-xl py-1 px-4 text-2xl" onChange={(e) => { if (e.target.value !== "default") addTag(e.target.value) }}>
                        <option value="default">+</option>
                        {tagOptionElements}
                    </select>
                </div>
                <div className="flex flex-row gap-3">
                    {/* TODO convert to common button style */}
                    <UmassPhotoButton className="bg-gray-400" type="button" onClick={closeCallback}>Close</UmassPhotoButton>
                    <div
                        aria-hidden="true"
                        className="grow"
                    ></div>
                    <UmassPhotoButton className="bg-umass-red" type="button" onClick={() => { setPreviewMode(previewMode => !previewMode) }}>Preview</UmassPhotoButton>
                    <UmassPhotoButton className="bg-umass-red" type="submit">Upload</UmassPhotoButton>
                </div>
            </form>
        </div>
    </div>
}