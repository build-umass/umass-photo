"use client";
import Image from "next/image";
import { useRef, useState } from "react";

export interface ImageSelectFieldHandle {
  imageDataURL: string;
  filename: string;
}

/**
 * A reusable component for selecting and previewing images with a data URL state.
 * Handles file input, FileReader processing, and image preview rendering.
 */
export default function ImageSelectField({
  id,
  name,
  onImageChange,
  className,
}: {
  id: string;
  name: string;
  onImageChange?: (imageDataURL: string) => void;
  className?: string;
}) {
  const imageField = useRef<HTMLInputElement | null>(null);
  const [imageDataURL, setImageDataUrl] = useState("");
  const [filename, setFilename] = useState("");

  function processFileLoad() {
    const selectedImage = imageField.current?.files?.item(0);
    if (!selectedImage) return;

    const fr = new FileReader();
    fr.onload = function () {
      if (typeof fr.result !== "string") {
        throw new Error("File was not read as a data URL!");
      }
      setImageDataUrl(fr.result);
      setFilename(selectedImage.name);
      onImageChange?.(fr.result);
    };
    fr.readAsDataURL(selectedImage);
  }

  const labelContents = imageDataURL ? (
    <div className="flex h-full w-full flex-col">
      <div className="relative grow">
        <Image
          src={imageDataURL}
          alt="selected image preview"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      {filename && <div className="mt-2 text-center text-sm">{filename}</div>}
    </div>
  ) : (
    "Click to select image"
  );

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        id={id}
        name={name}
        ref={imageField}
        onChange={processFileLoad}
        className="hidden"
      />
      <label
        htmlFor={id}
        className="cursor-camera flex h-full w-full items-center justify-center border-2 border-dashed border-gray-600 bg-gray-300 p-2"
      >
        {labelContents}
      </label>
    </div>
  );
}
