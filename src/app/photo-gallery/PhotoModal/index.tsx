"use client";
import stockPhoto from "../../../../public/stock-photo.jpg";
import BackArrow from "../../../../public/back_arrow.svg";
import ForwardArrow from "../../../../public/forward_arrow.svg";
import CloseIcon from "../../../../public/close.svg";
import Image from "next/image";
import { useState } from "react";
import "./photoModal.css";
import PhotoDeletionModal from "./PhotoDeletionModal";

export interface PhotoItem {
  id: number;
  title: string;
  author: string;
  authorId: number;
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
  currentUserId,
  onPhotoDeleted,
}: {
  closeModal: () => void;
  goToPreviousPhoto: () => void;
  goToNextPhoto: () => void;
  onFirstPhoto: boolean;
  onLastPhoto: boolean;
  selectedPhoto: PhotoItem;
  currentUserId: number | null;
  onPhotoDeleted: () => void;
}) {
  const [modalImageError, setModalImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleModalImageError = () => {
    setModalImageError(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    // TODO: Implement actual delete API call here
    // Example:
    // await fetch(`/api/delete-photo/${selectedPhoto.id}`, { method: 'DELETE' });
    console.log(`Deleting photo: ${selectedPhoto.id}`);
    setIsDeleting(false);
    setShowDeleteModal(false);
    closeModal();
    onPhotoDeleted();
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

        {/* Delete Button - Only show if current user is the author */}
        {currentUserId && currentUserId === selectedPhoto.authorId && (
          <button
            id="modal-delete"
            onClick={handleDeleteClick}
            className="cursor-camera"
          >
            🗑️
          </button>
        )}

        {/* Photo */}
        <Image
          src={
            modalImageError || !selectedPhoto.imageUrl
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

      {/* Photo Deletion Modal */}
      {showDeleteModal && (
        <PhotoDeletionModal
          closeCallback={handleCancelDelete}
          photoTitle={selectedPhoto.title}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
