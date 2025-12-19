"use client";

import React, { useState, useEffect } from 'react';
import menu from '../../../../public/menu.svg';
import './filterMenu.css';

interface Author {
    id: string;
    username: string;
}

interface FilterMenuProps {
    onFilterSubmit: (filters: {
        filtering_tags: boolean;
        filtering_authors: boolean;
        filtering_date: boolean;
        querytags: string[];
        queryauthor: string;
        querystart: string;
        queryend: string;
    }) => void;
}

const FilterMenu = ({ onFilterSubmit }: FilterMenuProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuClosing, setMenuClosing] = useState(false);
    const [showUploadDate, setShowUploadDate] = useState(false);
    const [showPhotographer, setShowPhotographer] = useState(false);
    const [showTags, setShowTags] = useState(false);
    const [closingSection, setClosingSection] = useState<'uploadDate' | 'photographer' | 'tags' | null>(null);
    
    // Filter state
    const [authors, setAuthors] = useState<Author[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const startOfDay = (date: string) => {
        return `${date}T00:00:00Z`;
    };

    const endOfDay = (date: string) => {
        return `${date}T23:59:59Z`;
    };

    // Fetch authors and tags on mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch('/api/filter-options');
                const result = await response.json();
                
                if (result.data) {
                    setAuthors(result.data.authors || []);
                    setTags(result.data.tags || []);
                }
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions();
    }, []);

    const handleSubmit = () => {
        const filters = {
            filtering_tags: selectedTags.size > 0,
            filtering_authors: selectedAuthor !== '',
            filtering_date: startDate !== '' && endDate !== '',
            querytags: Array.from(selectedTags),
            queryauthor: selectedAuthor,
            querystart: startDate ? startOfDay(startDate) : '',
            queryend: endDate ? endOfDay(endDate) : ''
        };

        onFilterSubmit(filters);
        handleMenuClose();
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tag)) {
                newSet.delete(tag);
            } else {
                newSet.add(tag);
            }
            return newSet;
        });
    };

    const selectAuthor = (authorId: string) => {
        setSelectedAuthor(prev => prev === authorId ? '' : authorId);
    };
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
            setShowUploadDate(false);
            setShowPhotographer(false);
            setShowTags(false);
            setClosingSection(null);
            
            setTimeout(() => {
                if (section === 'uploadDate') setShowUploadDate(true);
                if (section === 'photographer') setShowPhotographer(true);
                if (section === 'tags') setShowTags(true);
            }, 50);
        }
    };

    return (
        <>
            <button 
                id="menu-icon-circle" 
                onClick={() => {
                    if (showMenu) {
                        handleMenuClose();
                    } else {
                        setShowMenu(true);
                    }
                }} 
                className={showMenu ? 'expanded' : ''}
            >
                <img src={menu.src} alt="Menu" id="menu-icon" />
            </button> 


            {showMenu && (
                
                <div id="menu-popup" className={menuClosing ? 'closing' : ''} onClick={handleMenuClose}>
                    
                    <div id="menu-content" className={menuClosing ? 'closing' : ''} onClick={(e) => e.stopPropagation()}>
                        <h1 id="popup-header">Filters</h1>
                        <hr id="menu-line" />
                        <div>
                            <h2 
                                id="popup-subheader" 
                                className={showUploadDate ? 'active' : ''}
                                onClick={() => handleSectionToggle('uploadDate')}
                                style={{
                                    cursor: 'pointer',
                                    fontWeight: showUploadDate ? 'bold' : 'normal'
                                }}
                            >
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
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                        <span>to</span>
                                        <input 
                                            type="date" 
                                            id="end-date"
                                            name="end-date"
                                            aria-label="End date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <hr id="menu-line" />
                        
                        <div>
                            <h2 
                                id="popup-subheader" 
                                className={showPhotographer ? 'active' : ''}
                                onClick={() => handleSectionToggle('photographer')}
                                style={{
                                    cursor: 'pointer',
                                    fontWeight: showPhotographer ? 'bold' : 'normal'
                                }}
                            >
                                <span>Photographer</span>
                                <span>▶</span>
                            </h2>
                            {showPhotographer && (
                                <div id="filter-container" className={closingSection === 'photographer' ? 'closing' : ''}>
                                    {authors.map((author) => (
                                        <button 
                                            key={author.id}
                                            id="photographer-button"
                                            onClick={() => selectAuthor(author.id)}
                                            style={{
                                                backgroundColor: selectedAuthor === author.id ? '#881C1C' : 'white',
                                                color: selectedAuthor === author.id ? 'white' : '#333'
                                            }}
                                        >
                                            {author.username}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <hr id="menu-line" />
                        
                        <div>
                            <h2 
                                id="popup-subheader" 
                                className={showTags ? 'active' : ''}
                                onClick={() => handleSectionToggle('tags')}
                                style={{
                                    cursor: 'pointer',
                                    fontWeight: showTags ? 'bold' : 'normal'
                                }}
                            >
                                <span>Tags</span>
                                <span>▶</span>
                            </h2>
                            {showTags && (
                                <div id="filter-container" className={closingSection === 'tags' ? 'closing' : ''}>
                                    {tags.map((tag) => (
                                        <button 
                                            key={tag}
                                            id="photographer-button"
                                            onClick={() => toggleTag(tag)}
                                            style={{
                                                backgroundColor: selectedTags.has(tag) ? '#881C1C' : 'white',
                                                color: selectedTags.has(tag) ? 'white' : '#333'
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <hr id="menu-line" />

                        <button id="submit-button" onClick={handleSubmit}>Submit</button>
                    </div>
                    
                </div>
            )}
        </>
    );
};

export default FilterMenu;

