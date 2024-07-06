// src/App.js

import React, { useState } from 'react';
import BacklogStories from './components/BacklogStories';
import ProjectPicker from './components/ProjectPicker';
import ProjectFields from './components/ProjectFields';
import TopNav from './components/TopNav';
import JIRA_CONFIG from './jiraConfig';
import ProjectSprints from './components/ProjectSprints';

function App() {
    const [activeTab, setActiveTab] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [pickerKey, setPickerKey] = useState(0); // Key to force re-render

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedProject(null);
        setPickerKey(pickerKey + 1); // Update the key to force re-render
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
    };

    return (
        <div className="App">
            <TopNav activeTab={activeTab} setActiveTab={handleTabChange} />
            {activeTab && <ProjectPicker key={pickerKey} onSelectProject={handleProjectSelect} />}
            {activeTab === 'BacklogStories' && selectedProject && <BacklogStories project={selectedProject} />}
            {activeTab === 'ProjectFields' && selectedProject && <ProjectFields selectedProject={selectedProject} />}
            {activeTab === 'ProjectSprints' && selectedProject && <ProjectSprints selectedProject={selectedProject} />}
        </div>
    );
}

export default App;