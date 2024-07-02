// src/components/BacklogStories.js

import React, { useEffect, useState } from 'react';
import { getIssuesForKanbanBoard, getIssueDetails } from '../jiraClient';
import JIRA_CONFIG from '../jiraConfig';
import './BacklogStories.css'; // Import the CSS file

const BacklogStories = () => {
    const [selectedProject, setSelectedProject] = useState(JIRA_CONFIG.PROJECTS[0]);
    const [stories, setStories] = useState([]);
    const [parentSummaries, setParentSummaries] = useState({});
    const [selectedStatuses, setSelectedStatuses] = useState(['Backlog', 'Selected For Development']); // Default statuses to include

    const handleProjectChange = (event) => {
        const project = JIRA_CONFIG.PROJECTS.find(proj => proj.projectKey === event.target.value);
        setSelectedProject(project);
    };

    const handleStatusChange = (event) => {
        const value = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedStatuses(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getIssuesForKanbanBoard(selectedProject.projectKey, selectedStatuses);
            setStories(result);

            // Fetch parent summaries
            const parentKeys = result
                .filter(story => story.fields.parent)
                .map(story => story.fields.parent.key);

            const uniqueParentKeys = [...new Set(parentKeys)];
            const parentSummaries = {};

            await Promise.all(uniqueParentKeys.map(async (parentKey) => {
                const parentIssue = await getIssueDetails(parentKey);
                parentSummaries[parentKey] = parentIssue.fields.summary;
            }));

            setParentSummaries(parentSummaries);
        };

        fetchData();
    }, [selectedProject, selectedStatuses]);

    return (
        <div className="backlog-stories-container">
            <h1>Backlog Stories</h1>
            <label htmlFor="project-select">Select Project:</label>
            <select id="project-select" onChange={handleProjectChange}>
                {JIRA_CONFIG.PROJECTS.map(project => (
                    <option key={project.projectKey} value={project.projectKey}>
                        {project.name}
                    </option>
                ))}
            </select>
            <label htmlFor="status-select">Select Columns (Statuses):</label>
            <select id="status-select" multiple={true} value={selectedStatuses} onChange={handleStatusChange}>
                <option value="Backlog">Backlog</option>
                <option value="Selected For Development">Escalated</option>
                {/* Add more status options as needed */}
            </select>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Issue Key</th>
                        <th>Summary</th>
                        <th>Parent</th>
                    </tr>
                </thead>
                <tbody>
                    {stories.map((story, index) => (
                        <tr key={story.id}>
                            <td>{index + 1}</td> {/* Rank is the index + 1 */}
                            <td>{story.key}</td>
                            <td>{story.fields.summary}</td>
                            <td>{story.fields.parent ? `${story.fields.parent.key}: ${parentSummaries[story.fields.parent.key] || 'Loading...'}` : 'No Parent'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BacklogStories;