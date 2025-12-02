'use client'
import UmassPhotoButton from "@/app/components/UmassPhotoButton";
import ImageSelectField from "@/app/components/ImageSelectField";
import ModalCommon from "@/app/components/modal/ModalCommon";
import { FormEvent, useEffect, useState } from "react";
import PreviewPage from "./PreviewPage";

export default function UploadChip({
    closeCallback
}: {
    closeCallback: () => void
}) {
    const [previewMode, setPreviewMode] = useState(false);
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

    const tagList = selectedTags.map(tag => <div key={tag} className="bg-gray-300 rounded-xl py-1 px-4 text-2xl flex align-middle gap-2">
        <div>{tag}</div>
        <button type="button" onClick={() => { removeTag(tag) }}>X</button>
    </div>)

    const tagOptionElements = Array.from(tagOptions).map(tag => <option key={tag} value={tag}>{tag}</option>)

    if (previewMode) {
        return (
            <ModalCommon>
                <PreviewPage previewImageUrl={imageDataURL} setPreviewMode={setPreviewMode}></PreviewPage>
            </ModalCommon>
        );
    }

    return (
        <ModalCommon>
            <form
                onSubmit={uploadPhoto}
                className="flex flex-col gap-4 h-full box-border"
            >
                <ImageSelectField id="file-upload-image" name="image" onImageChange={setImageDataUrl} className="grow"/>
                <input type="text" name="title" className="bg-gray-200 p-3 rounded-xl text-3xl font-bold" placeholder="Title" required></input>
                <textarea name="description" className="bg-gray-200 p-3 rounded-xl grow" placeholder="description" required></textarea>
                <div className="flex flex-row flex-wrap gap-3 align-middle">
                    {tagList}
                    <select value="default" className="bg-gray-300 rounded-xl py-1 px-4 text-2xl appearance-none w-16 text-center" onChange={(e) => { if (e.target.value !== "default") addTag(e.target.value) }}>
                        <option value="default">+</option>
                        {tagOptionElements}
                    </select>
                </div>
                <div className="flex flex-row gap-3">
                    <UmassPhotoButton className="bg-gray-400" type="button" onClick={closeCallback}>Close</UmassPhotoButton>
                    <div
                        aria-hidden="true"
                        className="grow"
                    ></div>
                    <UmassPhotoButton className="bg-umass-red" type="button" onClick={() => { setPreviewMode(previewMode => !previewMode) }}>Preview</UmassPhotoButton>
                    <UmassPhotoButton className="bg-umass-red" type="submit">Upload</UmassPhotoButton>
                </div>
            </form>
        </ModalCommon>
    );
}
