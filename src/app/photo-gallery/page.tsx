"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import stockPhoto from '../../../public/stock-photo.jpg';
import BackArrow from '../../../public/back_arrow.svg';
import ForwardArrow from '../../../public/forward_arrow.svg';
import CloseIcon from '../../../public/close.svg';
import Navbar from '../components/navbar/navbar';
import { parseBooleanParam, parseStringParam, parseCommaSeparatedListParam, parseDateParam } from './queryValidation';
import FilterMenu from '../components/filter-menu/filterMenu';
import './photoGallery.css';
import UploadChip from './UploadChip';
import Image from 'next/image';

interface PhotoItem {
    id: number;
    title: string;
    author: string;
    date: string;
    imageUrl?: string;
}

const PhotoGallery = () => {
    const searchParams = useSearchParams();
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const [defaultTagsForUpload, setDefaultTagsForUpload] = useState<string[]>([])
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    const [modalImageError, setModalImageError] = useState(false);

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
            let url = '/api/get-photos';

            if (filters) {
                const params = new URLSearchParams({
                    filtering_tags: filters.filtering_tags.toString(),
                    filtering_authors: filters.filtering_authors.toString(),
                    filtering_date: filters.filtering_date.toString(),
                    querytags: JSON.stringify(filters.querytags),
                    queryauthor: filters.queryauthor,
                    querystart: filters.querystart,
                    queryend: filters.queryend
                });
                url = `/api/filter-photos?${params.toString()}`;
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result.data) {
                setPhotos(result.data);
            } else {
                console.error('Error fetching photos:', result.error);
                setPhotos([]);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const uploading = parseBooleanParam(searchParams.get('uploadingPhoto'), 'uploadingPhoto');
        if (uploading === true) {
            setUploadingPhoto(true);
        }

        const selectedAuthor = parseStringParam(searchParams.get('selectedAuthor'), 'selectedAuthor');
        const selectedTags = parseCommaSeparatedListParam(searchParams.get('selectedTags'), 'selectedTags');
        const defaultTags = parseCommaSeparatedListParam(searchParams.get('defaultTags'), 'defaultTags');
        const startDate = parseDateParam(searchParams.get('startDate'), 'startDate');
        const endDate = parseDateParam(searchParams.get('endDate'), 'endDate');

        // Store default tags for upload
        setDefaultTagsForUpload(Array.from(defaultTags));

        const hasFilters = selectedAuthor !== '' || selectedTags.size > 0 || (startDate !== '' && endDate !== '');
        if (hasFilters) {
            const filters = {
                filtering_tags: selectedTags.size > 0,
                filtering_authors: selectedAuthor !== '',
                filtering_date: startDate !== '' && endDate !== '',
                querytags: Array.from(selectedTags) as string[],
                queryauthor: selectedAuthor,
                querystart: startDate,
                queryend: endDate
            };
            fetchPhotos(filters);
        } else {
            fetchPhotos();
        }
    }, [searchParams]);

    const handleFilterSubmit = (filters: {
        filtering_tags: boolean;
        filtering_authors: boolean;
        filtering_date: boolean;
        querytags: string[];
        queryauthor: string;
        querystart: string;
        queryend: string;
    }) => {
        fetchPhotos(filters);
    };

    const handleImageError = (photoId: number) => {
        setImageErrors(prev => new Set(prev).add(photoId));
    };

    const openModal = (index: number) => {
        setSelectedPhotoIndex(index);
        setModalImageError(false);
    };

    const closeModal = () => {
        setSelectedPhotoIndex(null);
        setModalImageError(false);
    };

    const goToPreviousPhoto = () => {
        if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
            setSelectedPhotoIndex(selectedPhotoIndex - 1);
            setModalImageError(false);
        }
    };

    const goToNextPhoto = () => {
        if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
            setSelectedPhotoIndex(selectedPhotoIndex + 1);
            setModalImageError(false);
        }
    };

    const handleModalImageError = () => {
        setModalImageError(true);
    };

    return (
        <div>
            <Navbar />
            <FilterMenu onFilterSubmit={handleFilterSubmit} />

            {/* Add Photo Button - positioned above filter button */}
            <button 
                id="add-photo-button" 
                onClick={() => setUploadingPhoto(prev => !prev)}
                className={uploadingPhoto ? 'expanded' : ''}
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
                                src={imageErrors.has(photo.id) || !photo.imageUrl ? stockPhoto.src : photo.imageUrl}
                                alt={photo.title || "Photo"}
                                id="photo-item"
                                onError={() => handleImageError(photo.id)}
                                onClick={() => openModal(index)}
                                style={{ cursor: 'pointer' }}
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
                <div id="photo-modal" onClick={closeModal}>
                    <div id="modal-content" onClick={(e) => e.stopPropagation()}>
                        {/* Navigation Arrows */}
                        <button
                            id="prev-arrow"
                            onClick={goToPreviousPhoto}
                            disabled={selectedPhotoIndex === 0}
                            style={{
                                opacity: selectedPhotoIndex === 0 ? 0.3 : 1,
                                cursor: selectedPhotoIndex === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <Image src={BackArrow.src} alt="Previous photo" width={128} height={128}/>
                        </button>
                        
                        <button
                            id="next-arrow"
                            onClick={goToNextPhoto}
                            disabled={selectedPhotoIndex === photos.length - 1}
                            style={{
                                opacity: selectedPhotoIndex === photos.length - 1 ? 0.3 : 1,
                                cursor: selectedPhotoIndex === photos.length - 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <Image src={ForwardArrow.src} alt="Next photo"  width={128} height={128}/>
                        </button>
                        
                        {/* Close Button */}
                        <button id="modal-close" onClick={closeModal}>
                            <Image src={CloseIcon.src} alt="Close modal"  width={128} height={128}/>
                        </button>
                        
                        {/* Photo */}
                        <Image
                            src={modalImageError || imageErrors.has(photos[selectedPhotoIndex].id) || !photos[selectedPhotoIndex].imageUrl 
                                ? stockPhoto.src 
                                : photos[selectedPhotoIndex].imageUrl
                            }
                            alt={photos[selectedPhotoIndex].title || "Photo"}
                            id="modal-photo"
                            onError={handleModalImageError}
                            width={0}
                            height={0}
                            unoptimized
                        />
                        
                        {/* Photo Details */}
                        <div id="modal-details">
                            <h2>{photos[selectedPhotoIndex].title}</h2>
                            <p>{photos[selectedPhotoIndex].author}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {uploadingPhoto ?
                <UploadChip
                    closeCallback={() => setUploadingPhoto(false)}
                    defaultTags={defaultTagsForUpload}
                ></UploadChip> :
                <></>}
        </div>
    );
};

export default PhotoGallery;
