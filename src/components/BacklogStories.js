import React, { useEffect, useState } from 'react';
import { getBacklogStories, getIssueDetails } from '../jiraClient';
import './BacklogStories.css'; // Import the CSS file

const BacklogStories = ({ selectedProject }) => {
    const [stories, setStories] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [parentSummaries, setParentSummaries] = useState({});

    useEffect(() => {
        if (selectedProject && selectedProject.Statuses) {
            setSelectedStatuses(selectedProject.Statuses.map(status => status.value)); // Default to all statuses
        }
    }, [selectedProject]);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedProject) {
                const result = await getBacklogStories(selectedProject.boardId, selectedProject.projectKey, selectedStatuses);
                setStories(result);
                
                console.log(result);

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
            }
        };

        fetchData();
    }, [selectedProject, selectedStatuses]);

    const handleStatusChange = (event) => {
        const { value, checked } = event.target;
        setSelectedStatuses((prevStatuses) =>
            checked ? [...prevStatuses, value] : prevStatuses.filter((status) => status !== value)
        );
    };

    if (!selectedProject) {
        return <div>Please select a project.</div>;
    }

    const renderValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'object' && value.value) {
            return value.value;
        }
        return typeof value === 'object' ? JSON.stringify(value) : value;
    };

    return (
        <div className="backlog-stories">
            <h1>Backlog Stories for {selectedProject.name}</h1>
            <div>
                {selectedProject.Statuses.map((status) => (
                    <label key={status.value}>
                        <input
                            type="checkbox"
                            value={status.value}
                            checked={selectedStatuses.includes(status.value)}
                            onChange={handleStatusChange}
                        />
                        {status.label}
                    </label>
                ))}
            </div>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Issue Key</th>
                        <th>Summary</th>
                        <th>Parent</th>
                        <th>Points</th>
                        <th>Estimated Completion</th>
                        <th>Sizing</th>
                    </tr>
                </thead>
                <tbody>
                    {stories.map((story, index) => (
                        <tr key={story.id}>
                            <td>{index + 1}</td>
                            <td>{story.key}</td>
                            <td>{story.fields.summary}</td>
                            <td>{story.fields.parent ? `${story.fields.parent.key} (${parentSummaries[story.fields.parent.key]})` : 'No Parent'}</td>
                            <td>{story.fields.customfield_10004 || 0}</td>
                            <td>{renderValue(story.estimatedCompletion)}</td>
                            <td>{renderValue(story.fields.customfield_13662)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BacklogStories;