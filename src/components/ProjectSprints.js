// src/components/ProjectSprints.js

import React, { useEffect, useState } from 'react';
import { getSprintsForBoard } from '../jiraClient';
import './ProjectSprints.css'; // Import the CSS file

const ProjectSprints = ({ selectedProject }) => {
    const [sprints, setSprints] = useState([]);

    useEffect(() => {
        if (!selectedProject) return;

        if (selectedProject.type === 'kanban') {
            setSprints([]); // Clear sprints if previously set
            return;
        }

        const fetchSprints = async () => {
            try {
                const boardSprints = await getSprintsForBoard(selectedProject.boardId);
                // Sort sprints: active sprint at the top, then descending by start date
                boardSprints.sort((a, b) => {
                    if (a.state === 'active') return -1;
                    if (b.state === 'active') return 1;
                    return new Date(b.startDate) - new Date(a.startDate);
                });
                setSprints(boardSprints);
            } catch (error) {
                console.error('Error fetching sprints:', error);
            }
        };

        fetchSprints();
    }, [selectedProject]);

    if (!selectedProject) {
        return <div>Please select a project to view its sprints.</div>;
    }

    if (selectedProject.type === 'kanban') {
        return <div className="kanban-message">A Kanban board has been selected; it has no sprints.</div>;
    }

    return (
        <div className="sprints-container">
            <h1>Sprints for {selectedProject.name}</h1>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Sprint Name</th>
                        <th>Sprint Start</th>
                        <th>Sprint End</th>
                    </tr>
                </thead>
                <tbody>
                    {sprints.map(sprint => (
                        <tr key={sprint.id}>
                            <td className={sprint.state === 'active' ? 'active-sprint' : sprint.state === 'future' ? 'future-sprint' : ''}>
                                {sprint.name}
                                {sprint.state === 'active' && ' (Active)'}
                                {sprint.state === 'future' && ' (Future)'}
                            </td>
                            <td>{new Date(sprint.startDate).toLocaleDateString()}</td>
                            <td>{new Date(sprint.endDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectSprints;