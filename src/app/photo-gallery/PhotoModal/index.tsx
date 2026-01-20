"use client";
import stockPhoto from "../../../../public/stock-photo.jpg";
import BackArrow from "../../../../public/back_arrow.svg";
import ForwardArrow from "../../../../public/forward_arrow.svg";
import CloseIcon from "../../../../public/close.svg";
import Image from "next/image";
import { useState } from "react";
import "./photoModal.css";

export interface PhotoItem {
  id: number;
  title: string;
  author: string;
  date: string;
  imageUrl?: string;
}

export default function PhotoModal({
  closeModal,
  goToPreviousPhoto,
  goToNextPhoto,
  onFirstPhoto,
  onLastPhoto,
  selectedPhoto,
}: {
  closeModal: () => void;
  goToPreviousPhoto: () => void;
  goToNextPhoto: () => void;
  onFirstPhoto: boolean;
  onLastPhoto: boolean;
  selectedPhoto: PhotoItem;
}) {
  const [modalImageError, setModalImageError] = useState(false);
  const handleModalImageError = () => {
    setModalImageError(true);
  };
  return (
    <div id="photo-modal" onClick={closeModal}>
      <div id="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Navigation Arrows */}
        <button
          id="prev-arrow"
          onClick={goToPreviousPhoto}
          disabled={onFirstPhoto}
          className={
            onFirstPhoto
              ? "cursor-not-allowed opacity-30"
              : "cursor-camera opacity-100"
          }
        >
          <Image
            src={BackArrow.src}
            alt="Previous photo"
            width={128}
            height={128}
            unoptimized
          />
        </button>

        <button
          id="next-arrow"
          onClick={goToNextPhoto}
          disabled={onLastPhoto}
          className={
            onLastPhoto
              ? "cursor-not-allowed opacity-30"
              : "cursor-camera opacity-100"
          }
        >
          <Image
            src={ForwardArrow.src}
            alt="Next photo"
            width={128}
            height={128}
            unoptimized
          />
        </button>

        {/* Close Button */}
        <button id="modal-close" onClick={closeModal}>
          <Image
            src={CloseIcon.src}
            alt="Close modal"
            width={128}
            height={128}
            unoptimized
          />
        </button>

        {/* Photo */}
        <Image
          src={
            modalImageError ||
            !selectedPhoto.imageUrl
              ? stockPhoto.src
              : selectedPhoto.imageUrl
          }
          alt={selectedPhoto.title || "Photo"}
          id="modal-photo"
          onError={handleModalImageError}
          width={0}
          height={0}
          unoptimized
        />

        {/* Photo Details */}
        <div id="modal-details">
          <h2>{selectedPhoto.title}</h2>
          <p>{selectedPhoto.author}</p>
        </div>
      </div>
    </div>
  );
}
