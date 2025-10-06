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
    const [menuClosing, setMenuClosing] = useState(false);
    const [showUploadDate, setShowUploadDate] = useState(false);
    const [showPhotographer, setShowPhotographer] = useState(false);
    const [showTags, setShowTags] = useState(false);
    const [closingSection, setClosingSection] = useState<'uploadDate' | 'photographer' | 'tags' | null>(null);
    
    const handleMenuClose = () => {
        setMenuClosing(true);
        setTimeout(() => {
            setShowMenu(false);
            setMenuClosing(false);
            setShowUploadDate(false);
            setShowPhotographer(false);
            setShowTags(false);
            setClosingSection(null);
        }, 300);
    };
    
    const handleSectionToggle = (section: 'uploadDate' | 'photographer' | 'tags' ) => {
        // If clicking the same section that's already open, close it
        if ((section === 'uploadDate' && showUploadDate) ||
            (section === 'photographer' && showPhotographer) ||
            (section === 'tags' && showTags)) {
            setClosingSection(section);
            setTimeout(() => {
                if (section === 'uploadDate') setShowUploadDate(false);
                if (section === 'photographer') setShowPhotographer(false);
                if (section === 'tags') setShowTags(false);
                setClosingSection(null);
            }, 300);
        } else {
            // Close all other sections first
            setShowUploadDate(false);
            setShowPhotographer(false);
            setShowTags(false);
            setClosingSection(null);
            
            // Then open the clicked section
            setTimeout(() => {
                if (section === 'uploadDate') setShowUploadDate(true);
                if (section === 'photographer') setShowPhotographer(true);
                if (section === 'tags') setShowTags(true);
            }, 50);
        }
    };

    const photos: PhotoItem[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        title: 'Lorem ipsum',
        author: 'John Doe',
        date: new Date(2023, 0, 1).toLocaleDateString(),
    }));

    return (
        <div>
            <Navbar/>
            <button id="menu-icon-circle" onClick={() => {
                if (showMenu) {
                    handleMenuClose();
                } else {
                    setShowMenu(true);
                }
            }} className={showMenu ? 'expanded' : ''}>
                <img src={menu.src} alt="Menu" id="menu-icon" />
                {/* <button  id="close-button"></button> */}
            </button> 

            {showMenu && (
                <div id="menu-popup" className={menuClosing ? 'closing' : ''} onClick={handleMenuClose}>
                    <div id="menu-content" className={menuClosing ? 'closing' : ''} onClick={(e) => e.stopPropagation()}>
                        <h1 id="popup-header" >Filters</h1>
                        <hr id="menu-line" />
                        <div>
                            <h2 id="popup-subheader" 
                                className={showUploadDate ? 'active' : ''}
                                onClick={() => handleSectionToggle('uploadDate')}
                                style={{
                                cursor: 'pointer',
                                fontWeight: showUploadDate ? 'bold' : 'normal'
                            }}>
                                <span>Upload Date</span>
                                <span>▶</span>
                            </h2>
                            {showUploadDate && (
                                <div id="filter-container" className={closingSection === 'uploadDate' ? 'closing' : ''}>
                                    <div id="upload-date-container">
                                        <span>from</span>
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
                                </div>
                            )}
                        </div>
                        
                        <hr id="menu-line" />
                        
                        <div>
                            <h2 id="popup-subheader" 
                                className={showPhotographer ? 'active' : ''}
                                onClick={() => handleSectionToggle('photographer')}
                                style={{
                                cursor: 'pointer',
                                fontWeight: showPhotographer ? 'bold' : 'normal'
                            }}>
                                <span>Photographer</span>
                                <span>▶</span>
                            </h2>
                            {showPhotographer && (
                                <div id="filter-container" className={closingSection === 'photographer' ? 'closing' : ''}>
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
                            <h2 id="popup-subheader" 
                                className={showTags ? 'active' : ''}
                                onClick={() => handleSectionToggle('tags')}
                                style={{
                                cursor: 'pointer',
                                fontWeight: showTags ? 'bold' : 'normal'
                            }}>
                                <span>Tags</span>
                                <span>▶</span>
                            </h2>
                            {showTags && (
                                <div id="filter-container" className={closingSection === 'tags' ? 'closing' : ''}>
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
                        <hr id="menu-line" />
                        
                        
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
