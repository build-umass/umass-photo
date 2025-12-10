'use client'
import UmassPhotoButton from "@/app/components/UmassPhotoButton";
import { FormEvent, useEffect, useRef, useState } from "react";
import PreviewPage from "./PreviewPage";
import Image from "next/image";

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
    const [newTagInput, setNewTagInput] = useState("")

    async function refreshTagList() {
        try {
            const response = await fetch('/api/get-tag-all', {
                method: 'GET',
            });
            const data = await response.json();
            
            // Ensure we have an array of strings
            if (Array.isArray(data)) {
                const tags = new Set(data as string[]);
                setTagOptions(tags);
            } else {
                console.log('Unexpected response format:', data);
                setTagOptions(new Set());
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
            setTagOptions(new Set());
        }
    }

    async function createTag(tagName: string) {
        const trimmed = tagName.trim();
        if (!trimmed) return;

        try {
            const response = await fetch('/api/create-tag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmed })
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to create tag';
                
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.error === 'Not authenticated') {
                        errorMessage = 'Please log in to create tags';
                    } else {
                        errorMessage = errorData.error || errorMessage;
                    }
                } catch {
                    errorMessage = errorText || errorMessage;
                }
                
                console.error('Failed to create tag:', errorMessage);
                alert(errorMessage);
                return;
            }

            // Update local tag options and select the new tag
            setTagOptions(prev => new Set([...Array.from(prev), trimmed]));
            addTag(trimmed);
            setNewTagInput("");
            // Also refresh from server to ensure global consistency
            await refreshTagList();
        } catch (err) {
            console.error('Error creating tag', err);
            alert('Network error: Unable to create tag');
        }
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

    const tagList = selectedTags.map(tag => <div key={tag} className="bg-gray-300 rounded-xl py-1 px-4 text-2xl flex align-middle gap-2">
        <div>{tag}</div>
        <button type="button" onClick={() => { removeTag(tag) }}>X</button>
    </div>)

    const tagOptionElements = Array.from(tagOptions).map(tag => <option key={tag} value={tag}>{tag}</option>)

    const fileSelectContent = imageDataURL ? <div className="flex flex-col w-full h-full">
        <div className="relative grow">
            <Image alt="Image Preview" src={imageDataURL} fill={true} className="object-contain"></Image>
        </div>
        <div className="text-center">{imageField.current?.value.substring(12)}</div>
    </div> : "Select a photo"
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
                <input
                    type="file"
                    name="image"
                    id="file-upload-image"
                    accept="image/*"
                    required
                    ref={imageField}
                    onChange={processFileLoad}
                    hidden
                ></input>
                <label
                    htmlFor="file-upload-image"
                    className="bg-gray-200 p-3 border-2 border-dashed border-gray-600 grow bg-cover bg-center"
                >{fileSelectContent}</label>
                <input type="text" name="title" className="bg-gray-200 p-3 rounded-xl text-3xl font-bold" placeholder="Title" required></input>
                <textarea name="description" className="bg-gray-200 p-3 rounded-xl grow" placeholder="description" required></textarea>
                    
                    {/* Custom tag input */}
                    <div className="flex gap-2 items-center w-lg">
                        <div className="flex flex-row flex-wrap gap-3 align-middle">
                            {tagList}
                            <select value="default" className="bg-gray-300 rounded-xl py-1 px-4 text-2xl appearance-none w-16 text-center" onChange={(e) => { if (e.target.value !== "default") addTag(e.target.value) }}>
                                <option value="default">+</option>
                                {tagOptionElements}
                            </select>
                        </div>
                        <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            placeholder="Create new tag..."
                            className="bg-gray-200 p-2 rounded-xl text-lg flex-grow"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createTag(newTagInput); } }}
                        />
                        <button 
                            type="button" 
                            onClick={() => createTag(newTagInput)} 
                            className="bg-umass-red text-white px-4 py-2 rounded-xl text-lg hover:bg-red-700 transition-colors"
                        >
                            Add Tag
                        </button>
                    </div>
                    
                    {/* Show available tags if any */}
                    {tagOptions.size > 0 && (
                        <div className="text-sm text-gray-600">
                            Available tags: {Array.from(tagOptions).join(", ")}
                        </div>
                    )}
                <div className="flex flex-row gap-3 ">
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