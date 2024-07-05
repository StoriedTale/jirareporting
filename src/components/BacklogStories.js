// src/components/BacklogStories.js

import React, { useEffect, useState } from 'react';
import { getIssuesForKanbanBoard, getIssueDetails } from '../jiraClient';
import JIRA_CONFIG from '../jiraConfig';
import './BacklogStories.css'; // Import the CSS file

const BacklogStories = ({ project }) => {
    const [stories, setStories] = useState([]);
    const [parentSummaries, setParentSummaries] = useState({});
    const [selectedStatuses, setSelectedStatuses] = useState(project.Statuses.map(status => status.value)); // Default to all statuses

    const handleStatusChange = (event) => {
        const value = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedStatuses(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getIssuesForKanbanBoard(project.projectKey, selectedStatuses);
            result.sort((a, b) => {
                const aPriority = project.Statuses.find(status => status.value === a.fields.status.name)?.priority || 999;
                const bPriority = project.Statuses.find(status => status.value === b.fields.status.name)?.priority || 999;
                return aPriority - bPriority;
            });
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
    }, [project, selectedStatuses]);

    const calculateCompletionWeek = (index, velocity, points) => {
        const totalPoints = stories.slice(0, index + 1).reduce((sum, story) => {
            //const storyPoints = story.fields.customfield_10004 !== undefined ? story.fields.customfield_10004 : project.default_pts || 0;
            const storyPoints = (story.fields.customfield_10004 !== undefined && story.fields.customfield_10004 !== null) ? story.fields.customfield_10004 : (project.default_pts !== undefined ? project.default_pts : 0);

            console.log(story.key, project.default_pts, storyPoints);
            return sum + storyPoints;
        }, 0);
        
        const totalWeeks = Math.ceil(totalPoints / velocity);
        const startDate = new Date();
        
        // Find the next Monday
        while (startDate.getDay() !== 1) {
            startDate.setDate(startDate.getDate() + 1);
        }
        
        // Add the number of weeks
        startDate.setDate(startDate.getDate() + (totalWeeks - 1) * 7);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 4); // Friday of the same week
        
        const formatDate = (date) => {
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(2);
            return `${month}/${day}/${year}`;
        };
        
        return `${formatDate(startDate)}-${formatDate(endDate)}`;
    };
    console.log(project);
    return (
        <div className="backlog-stories-container">
            <h1>Backlog Stories</h1>
            <label htmlFor="status-select">Select Columns (Statuses):</label>
            <select id="status-select" multiple={true} value={selectedStatuses} onChange={handleStatusChange}>
                {project.Statuses.map(status => (
                    <option key={status.value} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </select>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Issue Key</th>
                        <th>Summary</th>
                        <th>Parent</th>
                        <th>Points</th> {/* New Points column */}
                        <th>Estimated Completion Week</th> {/* New Completion Week column */}
                    </tr>
                </thead>
                <tbody>
                    {stories.map((story, index) => (
                        <tr key={story.id}>
                            <td>{index + 1}</td> {/* Rank is the index + 1 */}
                            <td>{story.key}</td>
                            <td>{story.fields.summary}</td>
                            <td>{story.fields.parent ? `${story.fields.parent.key}: ${parentSummaries[story.fields.parent.key] || 'Loading...'}` : 'No Parent'}</td>
                            <td>{story.fields.customfield_10004 !== undefined ? story.fields.customfield_10004 : project.default_pts || ''}</td> {/* Display Points */}
                            <td>{calculateCompletionWeek(index, project.velocity, story.fields.customfield_10004)}</td> {/* Display Estimated Completion Week */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BacklogStories;