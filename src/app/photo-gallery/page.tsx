"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import stockPhoto from "../../../public/stock-photo.jpg";
import {
  parseBooleanParam,
  parseStringParam,
  parseCommaSeparatedListParam,
  parseDateParam,
} from "./queryValidation";
import FilterMenu from "../components/filter-menu/filterMenu";
import "./photoGallery.css";
import UploadChip from "./UploadChip";
import Image from "next/image";
import PhotoModal, { PhotoItem } from "./PhotoModal";

const PhotoGallery = () => {
  const searchParams = useSearchParams();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [defaultTagsForUpload, setDefaultTagsForUpload] = useState<string[]>(
    [],
  );
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [filtering_tags, setFilteringTags] = useState<boolean>(false);
  const [filtering_authors, setFilteringAuthors] = useState<boolean>(false);
  const [filtering_date, setFilteringDate] = useState<boolean>(false);
  const [querytags, setQueryTags] = useState<string[]>([]);
  const [queryauthor, setQueryAuthor] = useState<string>("");
  const [querystart, setQueryStart] = useState<string>("");
  const [queryend, setQueryEnd] = useState<string>("");

  const fetchPhotos = async (filters?: {
    filtering_tags: boolean;
    filtering_authors: boolean;
    filtering_date: boolean;
    querytags: string[];
    queryauthor: string;
    querystart: string;
    queryend: string;
  }) => {
    try {
      setLoading(true);
      let url = "/api/get-photos";

      if (filters) {
        const params = new URLSearchParams({
          filtering_tags: filters.filtering_tags.toString(),
          filtering_authors: filters.filtering_authors.toString(),
          filtering_date: filters.filtering_date.toString(),
          querytags: JSON.stringify(filters.querytags),
          queryauthor: filters.queryauthor,
          querystart: filters.querystart,
          queryend: filters.queryend,
        });
        url = `/api/filter-photos?${params.toString()}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.data) {
        setPhotos(result.data);
      } else {
        console.error("Error fetching photos:", result.error);
        setPhotos([]);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const uploading = parseBooleanParam(
      searchParams.get("uploadingPhoto"),
      "uploadingPhoto",
    );
    if (uploading === true) {
      setUploadingPhoto(true);
    }

    const selectedAuthor = parseStringParam(
      searchParams.get("selectedAuthor"),
      "selectedAuthor",
    );
    const selectedTags = parseCommaSeparatedListParam(
      searchParams.get("selectedTags"),
      "selectedTags",
    );
    const defaultTags = parseCommaSeparatedListParam(
      searchParams.get("defaultTags"),
      "defaultTags",
    );
    const startDate = parseDateParam(
      searchParams.get("startDate"),
      "startDate",
    );
    const endDate = parseDateParam(searchParams.get("endDate"), "endDate");

    // Store default tags for upload
    setDefaultTagsForUpload(Array.from(defaultTags));

    const hasFilters =
      selectedAuthor !== "" ||
      selectedTags.size > 0 ||
      (startDate !== "" && endDate !== "");
    if (hasFilters) {
      const filters = {
        filtering_tags: selectedTags.size > 0,
        filtering_authors: selectedAuthor !== "",
        filtering_date: startDate !== "" && endDate !== "",
        querytags: Array.from(selectedTags) as string[],
        queryauthor: selectedAuthor,
        querystart: startDate,
        queryend: endDate,
      };
      fetchPhotos(filters);
    } else {
      fetchPhotos();
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/get-user-self");
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.id);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleFilterSubmit = (filters: {
    filtering_tags: boolean;
    filtering_authors: boolean;
    filtering_date: boolean;
    querytags: string[];
    queryauthor: string;
    querystart: string;
    queryend: string;
  }) => {
    setFilteringTags(filters.filtering_tags);
    setFilteringAuthors(filters.filtering_authors);
    setFilteringDate(filters.filtering_date);
    setQueryTags(filters.querytags.map((x) => x));
    setQueryAuthor(filters.queryauthor);
    setQueryStart(filters.querystart);
    setQueryEnd(filters.queryend);
    fetchPhotos(filters);
  };

  const refreshSearchResults = async () => {
    await fetchPhotos({
      filtering_tags,
      filtering_authors,
      filtering_date,
      querytags,
      queryauthor,
      querystart,
      queryend,
    });
  };

  const handleImageError = (photoId: number) => {
    setImageErrors((prev) => new Set(prev).add(photoId));
  };

  const openModal = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeModal = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePhotoDeleted = () => {
    fetchPhotos();
  };

  const goToPreviousPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const goToNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const onLastPhoto = selectedPhotoIndex === photos.length - 1;
  const onFirstPhoto = selectedPhotoIndex === 0;

  return (
    <div>
      <FilterMenu onFilterSubmit={handleFilterSubmit} />

      {/* Add Photo Button - positioned above filter button */}
      <button
        id="add-photo-button"
        onClick={() => setUploadingPhoto((prev) => !prev)}
        className={`${uploadingPhoto ? "expanded" : ""} cursor-camera`}
      >
        <span>+</span>
      </button>

      <div id="photo-grid">
        {loading ? (
          <div>Loading photos...</div>
        ) : photos.length === 0 ? (
          <div>No photos found.</div>
        ) : (
          photos.map((photo, index) => (
            <div key={photo.id}>
              <Image
                src={
                  imageErrors.has(photo.id) || !photo.imageUrl
                    ? stockPhoto.src
                    : photo.imageUrl
                }
                alt={photo.title || "Photo"}
                id="photo-item"
                onError={() => handleImageError(photo.id)}
                onClick={() => openModal(index)}
                className="cursor-camera"
                width={1024}
                height={1024}
              />
              <div id="details-container">
                <div id="title-author-flex">
                  <h3 id="title">{photo.title}</h3>
                  <p id="author">{photo.author}</p>
                </div>
                <p id="upload-date">Uploaded {photo.date}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhotoIndex !== null && (
        <PhotoModal
          closeModal={closeModal}
          goToPreviousPhoto={goToPreviousPhoto}
          goToNextPhoto={goToNextPhoto}
          onFirstPhoto={onFirstPhoto}
          onLastPhoto={onLastPhoto}
          selectedPhoto={photos[selectedPhotoIndex]}
          currentUserId={currentUserId}
          onPhotoDeleted={handlePhotoDeleted}
        ></PhotoModal>
      )}

      {uploadingPhoto ? (
        <UploadChip
          closeCallback={() => setUploadingPhoto(false)}
          defaultTags={defaultTagsForUpload}
          uploadCallback={refreshSearchResults}
        ></UploadChip>
      ) : (
        <></>
      )}
    </div>
  );
};

function PhotoGalleryWrapper() {
  return (
    <Suspense fallback={<div>Loading Photo Gallery...</div>}>
      <PhotoGallery />
    </Suspense>
  );
}

export default PhotoGalleryWrapper;
