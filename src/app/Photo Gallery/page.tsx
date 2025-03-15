import React from 'react';
import stockPhoto from '../../../public/stock-photo.jpg';
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
            <div className="photo-grid">
                {photos.map((photo) => (
                    <div key={photo.id}>
                        <img src={stockPhoto.src} alt="Stock photo" className="photo-item" />
                        
                        <div className="details-container">
                            <h3>{photo.title} by {photo.author}</h3>
                            <p>{photo.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGallery;
