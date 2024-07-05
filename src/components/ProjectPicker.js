// src/components/ProjectPicker.js

import React, { useState } from 'react';
import JIRA_CONFIG from '../jiraConfig';
import './ProjectPicker.css';

const ProjectPicker = ({ onSelectProject }) => {
    const [selectedProjectKey, setSelectedProjectKey] = useState('');

    const handleProjectChange = (event) => {
        const projectKey = event.target.value;
        setSelectedProjectKey(projectKey);
        const project = JIRA_CONFIG.PROJECTS.find(proj => proj.projectKey === projectKey);
        onSelectProject(project);
    };

    return (
        <div className="project-picker">
            <label htmlFor="project-select">Select Project:</label>
            <select id="project-select" value={selectedProjectKey} onChange={handleProjectChange}>
                <option value="">--Select a Project--</option>
                {JIRA_CONFIG.PROJECTS.map(project => (
                    <option key={project.projectKey} value={project.projectKey}>
                        {project.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProjectPicker;