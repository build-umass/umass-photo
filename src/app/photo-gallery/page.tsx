'use client'
import React, { useState } from 'react';
import stockPhoto from '../../../public/stock-photo.jpg';
import menu from '../../../public/menu.svg';
import './photoGallery.css';
import UploadChip from './UploadChip';

interface PhotoItem {
    id: number;
    title: string;
    author: string;
    date: string;
}

const PhotoGallery = () => {
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const photos: PhotoItem[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        title: 'Lorem ipsum',
        author: 'John Doe',
        date: new Date(2023, 0, 1).toLocaleDateString(),
    }));

    const addPhotoButton = <button onClick={() => setUploadingPhoto(true)}>Add Photo</button>

    const photoElements = photos.map((photo) => (
        <div key={photo.id}>
            <img src={stockPhoto.src} alt="Stock photo" id="photo-item" />
            <div id="details-container">
                <div id="title-author-flex">
                    <h3 id="title">{photo.title}</h3>
                    <p id="author">{photo.author}</p>
                </div>
                <p id="upload-date">Uploaded {photo.date}</p>
            </div>

        </div>
    ))

    return (
        <div>
            <img src={menu.src} alt="Menu" id="menu-icon" />
            <div id="photo-grid">
                {[addPhotoButton, ...photoElements]}
            </div>
            {
                uploadingPhoto ?
                    <UploadChip
                        closeCallback={() => setUploadingPhoto(false)}
                    ></UploadChip> :
                    <></>}
        </div>
    );
};

export default PhotoGallery;
