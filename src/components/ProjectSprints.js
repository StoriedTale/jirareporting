// src/components/ProjectSprints.js

import React, { useEffect, useState } from 'react';
import { getSprintsForBoard } from '../jiraClient';
import './ProjectSprints.css'; // Import the CSS file

const ProjectSprints = ({ selectedProject }) => {
    const [sprints, setSprints] = useState([]);

    useEffect(() => {
        const fetchSprints = async () => {
            const boardSprints = await getSprintsForBoard(selectedProject.boardId);
            setSprints(boardSprints);
        };

        fetchSprints();
    }, [selectedProject]);

    return (
        <div className="sprints-container">
            <h1>Sprints for {selectedProject.name}</h1>
            <ul className="sprints-list">
                {sprints.map(sprint => (
                    <li key={sprint.id}>
                        <strong>{sprint.name}</strong>: {sprint.state}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectSprints;