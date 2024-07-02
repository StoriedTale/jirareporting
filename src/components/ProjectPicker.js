// src/components/ProjectPicker.js

import React, { useState } from 'react';
import JIRA_CONFIG from '../jiraConfig';
import ProjectFields from './ProjectFields';
import ProjectSprints from './ProjectSprints';
import './ProjectPicker.css'; // Import the CSS file

const ProjectPicker = () => {
    const [selectedProject, setSelectedProject] = useState(JIRA_CONFIG.PROJECTS[0]);

    const handleProjectChange = (event) => {
        const project = JIRA_CONFIG.PROJECTS.find(proj => proj.projectKey === event.target.value);
        setSelectedProject(project);
    };

    return (
        <div className="project-picker-container">
            <h1>Selected Project</h1>
            <label htmlFor="project-select">Select Project:</label>
            <select id="project-select" onChange={handleProjectChange}>
                {JIRA_CONFIG.PROJECTS.map(project => (
                    <option key={project.projectKey} value={project.projectKey}>
                        {project.name}
                    </option>
                ))}
            </select>
            <ul>
                <li><strong>Project Key: </strong>{selectedProject.projectKey}</li>
                <li><strong>Project ID: </strong>{selectedProject.boardId}</li>
            </ul>
            
            <ProjectFields selectedProject={selectedProject} />
            
        </div>
    );
};

export default ProjectPicker;