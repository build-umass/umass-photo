"use client";

import React, { useState } from 'react';
import stockPhoto from '../../../public/stock-photo.jpg';
import menu from '../../../public/menu.svg';
import Navbar from '../components/navbar/navbar';
import './photoGallery.css';

interface PhotoItem {
    id: number;
    title: string;
    author: string;
    date: string;
}

const PhotoGallery = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showUploadDate, setShowUploadDate] = useState(false);
    const [showPhotographer, setShowPhotographer] = useState(false);
    const [showTags, setShowTags] = useState(false);
    const photos: PhotoItem[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        title: 'Lorem ipsum',
        author: 'John Doe',
        date: new Date(2023, 0, 1).toLocaleDateString(),
    }));

    return (
        <div>
            <Navbar/>
            <div id="menu-icon-circle">
                <img src={menu.src} alt="Menu" id="menu-icon" onClick={() => setShowMenu(!showMenu)} />
                <button onClick={() => setShowMenu(false)} id="close-button"></button>
            </div> 

            
            
            {showMenu && (
                <div id="menu-popup" onClick={() => setShowMenu(false)}>
                    <div id="menu-content" onClick={(e) => e.stopPropagation()}>
                        <h1 id="popup-header" >Filters</h1>
                        <hr id="menu-line" />
                        
                        <div>
                            <h2 id="popup-subheader" onClick={() => {
                                setShowUploadDate(!showUploadDate);
                                setShowPhotographer(false);
                                setShowTags(false);
                            }} style={{cursor: 'pointer'}}>
                                <span>Upload Date</span>
                                <span>{showUploadDate ? '▼' : '▶'}</span>
                            </h2>
                            {showUploadDate && (
                                <div id="filter-container">
                                    <input 
                                        type="date" 
                                        id="start-date"
                                        name="start-date"
                                        aria-label="Start date"
                                    />
                                    <span>to</span>
                                    <input 
                                        type="date" 
                                        id="end-date"
                                        name="end-date"
                                        aria-label="End date"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <hr id="menu-line" />
                        
                        <div>
                            <h2 id="popup-subheader" onClick={() => {
                                setShowPhotographer(!showPhotographer);
                                setShowUploadDate(false);
                                setShowTags(false);
                            }} style={{cursor: 'pointer'}}>
                                <span>Photographer</span>
                                <span>{showPhotographer ? '▼' : '▶'}</span>
                            </h2>
                            {showPhotographer && (
                                <div id="filter-container">
                                    <button id="photographer-button">John Doe</button>
                                    <button id="photographer-button">Jane Smith</button>
                                    <button id="photographer-button">Alice Johnson</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                    <button id="photographer-button">Bob Brown</button>
                                </div>
                            )}
                        </div>
                        
                        <hr id="menu-line" />
                        
                        <div>
                            <h2 id="popup-subheader" onClick={() => {
                                setShowTags(!showTags);
                                setShowUploadDate(false);
                                setShowPhotographer(false);
                            }} style={{cursor: 'pointer'}}>
                                <span>Tags</span>
                                <span>{showTags ? '▼' : '▶'}</span>
                            </h2>
                            {showTags && (
                                <div id="filter-container">
                                    <button id="photographer-button">Nature</button>
                                    <button id="photographer-button">Portrait</button>
                                    <button id="photographer-button">Landscape</button>
                                    <button id="photographer-button">Architecture</button>
                                    <button id="photographer-button">Event</button>
                                    <button id="photographer-button">Street</button>
                                    <button id="photographer-button">Abstract</button>
                                    <button id="photographer-button">Black & White</button>
                                    <button id="photographer-button">Macro</button>
                                    <button id="photographer-button">Wildlife</button>
                                    <button id="photographer-button">Sports</button>
                                    <button id="photographer-button">Travel</button>
                                    <button id="photographer-button">Fashion</button>
                                    <button id="photographer-button">Food</button>
                                    <button id="photographer-button">Documentary</button>
                                    <button id="photographer-button">Fine Art</button>
                                </div>
                            )}
                        </div>
                        
                        
                    </div>
                </div>
            )}
            
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
