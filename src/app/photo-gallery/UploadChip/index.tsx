"use client";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import ImageSelectField from "@/app/components/ImageSelectField";
import ModalCommon from "@/app/components/ChipLayout";
import { FormEvent, useEffect, useState } from "react";
import PreviewPage from "./PreviewPage";
import UmassPhotoButtonGray from "@/app/components/UmassPhotoButton/UmassPhotoButtonGray";

export default function UploadChip({
  closeCallback,
  uploadCallback,
  defaultTags = [],
}: {
  closeCallback: () => void;
  uploadCallback: () => void;
  defaultTags?: string[];
}) {
  const [previewMode, setPreviewMode] = useState(false);
  const [imageDataURL, setImageDataUrl] = useState("");
  const [tagOptions, setTagOptions] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultTags);
  const [newTagInput, setNewTagInput] = useState("");

  async function refreshTagList() {
    try {
      const response = await fetch("/api/get-tag-all", {
        method: "GET",
      });
      const data = await response.json();

      // Ensure we have an array of strings
      if (Array.isArray(data)) {
        const tags = new Set(data as string[]);
        setTagOptions(tags);
      } else {
        console.log("Unexpected response format:", data);
        setTagOptions(new Set());
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTagOptions(new Set());
    }
  }

  async function createTag(tagName: string) {
    const trimmed = tagName.trim();
    if (!trimmed) return;

    try {
      const response = await fetch("/api/create-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to create tag";

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error === "Not authenticated") {
            errorMessage = "Please log in to create tags";
          } else {
            errorMessage = errorData.error || errorMessage;
          }
        } catch {
          errorMessage = errorText || errorMessage;
        }

        console.error("Failed to create tag:", errorMessage);
        alert(errorMessage);
        return;
      }

      setTagOptions((prev) => new Set([...Array.from(prev), trimmed]));
      addTag(trimmed);
      setNewTagInput("");

      await refreshTagList();
    } catch (err) {
      console.error("Error creating tag", err);
      alert("Network error: Unable to create tag");
    }
  }

  async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set("tags", JSON.stringify(selectedTags));
    const response = await fetch("/api/upload-photo", {
      method: "POST",
      body: formData,
    });
    switch (response.status) {
      case 201:
        uploadCallback();
        closeCallback();
        return;
      default:
        throw Error("Bad Upload!");
    }
  }

  function addTag(tag: string) {
    setSelectedTags((selectedTags) => {
      if (selectedTags.includes(tag)) {
        return selectedTags;
      } else {
        return [...selectedTags, tag];
      }
    });
  }

  function removeTag(tagToRemove: string) {
    setSelectedTags((selectedTags) => {
      return selectedTags.filter((tag) => tag !== tagToRemove);
    });
  }

  useEffect(() => {
    refreshTagList();
  }, []);

  const tagList = selectedTags.map((tag) => (
    <div
      key={tag}
      className="flex gap-2 rounded-xl bg-gray-300 px-4 py-1 align-middle text-2xl"
    >
      <div>{tag}</div>
      <button
        type="button"
        onClick={() => {
          removeTag(tag);
        }}
        className="cursor-camera"
      >
        X
      </button>
    </div>
  ));

  const tagOptionElements = Array.from(tagOptions).map((tag) => (
    <option key={tag} value={tag}>
      {tag}
    </option>
  ));

  if (previewMode) {
    return (
      <ModalCommon>
        <PreviewPage
          previewImageUrl={imageDataURL}
          setPreviewMode={setPreviewMode}
        ></PreviewPage>
      </ModalCommon>
    );
  }

  return (
    <ModalCommon>
      <form
        onSubmit={uploadPhoto}
        className="box-border flex h-full flex-col gap-4"
      >
        <ImageSelectField
          id="file-upload-image"
          name="image"
          onImageChange={setImageDataUrl}
          className="grow"
        />
        <input
          type="text"
          name="title"
          className="rounded-xl bg-gray-200 p-3 text-3xl font-bold"
          placeholder="Title"
          required
        ></input>
        <textarea
          name="description"
          className="grow rounded-xl bg-gray-200 p-3"
          placeholder="description"
          required
        ></textarea>
        <div className="flex flex-row flex-wrap gap-3 align-middle">
          {tagList}
          <select
            value="default"
            className="cursor-camera w-16 appearance-none rounded-xl bg-gray-300 px-4 py-1 text-center text-2xl"
            onChange={(e) => {
              if (e.target.value !== "default") addTag(e.target.value);
            }}
          >
            <option value="default">+</option>
            {tagOptionElements}
          </select>
        </div>

        <div className="flex w-lg items-center gap-2">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            placeholder="Create new tag..."
            className="grow rounded-xl bg-gray-200 p-2 text-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                createTag(newTagInput);
              }
            }}
          />
          <button
            type="button"
            onClick={() => createTag(newTagInput)}
            className="bg-umass-red cursor-camera rounded-xl px-4 py-2 text-lg text-white transition-colors hover:bg-red-700"
          >
            Add Tag
          </button>
        </div>

        <div className="flex flex-row gap-3">
          <UmassPhotoButtonGray onClick={closeCallback} type="button">
            Close
          </UmassPhotoButtonGray>
          <div aria-hidden="true" className="grow"></div>
          <UmassPhotoButtonRed
            onClick={() => {
              setPreviewMode((previewMode) => !previewMode);
            }}
            type="button"
          >
            Preview
          </UmassPhotoButtonRed>
          <UmassPhotoButtonRed type="submit">Upload</UmassPhotoButtonRed>
        </div>
      </form>
    </ModalCommon>
  );
}
