import React from 'react';
import stockPhoto from '../../../public/stock-photo.jpg';
import menu from '../../../public/menu.svg';
import './photoGallery.css';

interface PhotoItem {
    id: number;
    title: string;
    author: string;
    date: string;
}

const PhotoGallery = () => {
    const photos: PhotoItem[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        title: 'Lorem ipsum',
        author: 'John Doe',
        date: new Date(2023, 0, 1).toLocaleDateString(),
    }));

    return (
        <div>
            <img src={menu.src} alt="Menu" id="menu-icon" />
            <div id="photo-grid">
                {photos.map((photo) => (
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
                ))}
            </div>
        </div>
    );
};

export default PhotoGallery;
