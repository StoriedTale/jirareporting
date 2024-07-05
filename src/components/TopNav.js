// src/components/TopNav.js

import React from 'react';
import './TopNav.css';

const TopNav = ({ activeTab, setActiveTab }) => {
    return (
        <div className="top-nav">
            <button
                className={`nav-button ${activeTab === 'ProjectSprints' ? 'active' : ''}`}
                onClick={() => setActiveTab('ProjectSprints')}
            >
                Project Sprints
            </button>
            <button
                className={`nav-button ${activeTab === 'BacklogStories' ? 'active' : ''}`}
                onClick={() => setActiveTab('BacklogStories')}
            >
                Backlog Stories
            </button>
            <button
                className={`nav-button ${activeTab === 'ProjectFields' ? 'active' : ''}`}
                onClick={() => setActiveTab('ProjectFields')}
            >
                Project Fields
            </button>
        </div>
    );
};

export default TopNav;