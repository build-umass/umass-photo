"use client";

import React, { useState, useEffect } from 'react';
import stockPhoto from '../../../public/stock-photo.jpg';
import Navbar from '../components/navbar/navbar';
import FilterMenu from '../components/filter-menu/filterMenu';
import './photoGallery.css';
import UploadChip from './UploadChip';

interface PhotoItem {
    id: number;
    title: string;
    author: string;
    date: string;
    imageUrl?: string;
}

const PhotoGallery = () => {
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

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

            // boilerplate
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
        fetchPhotos();
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
        fetchPhotos(filters);
    };

    const handleImageError = (photoId: number) => {
        setImageErrors(prev => new Set(prev).add(photoId));
    };

    const addPhotoButton = <button onClick={() => setUploadingPhoto(true)}>Add Photo</button>

    return (
        <div>
            <Navbar />
            <FilterMenu onFilterSubmit={handleFilterSubmit} />

            <div id="photo-grid">
                {addPhotoButton}
                {loading ? (
                    <div>Loading photos...</div>
                ) : photos.length === 0 ? (
                    <div>No photos found.</div>
                ) : (
                    photos.map((photo) => (
                        <div key={photo.id}>
                            <img
                                src={imageErrors.has(photo.id) || !photo.imageUrl ? stockPhoto.src : photo.imageUrl}
                                alt={photo.title || "Photo"}
                                id="photo-item"
                                onError={() => handleImageError(photo.id)}
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
            {uploadingPhoto ?
                <UploadChip
                    closeCallback={() => setUploadingPhoto(false)}
                ></UploadChip> :
                <></>}
        </div>
    );
};

export default PhotoGallery;
