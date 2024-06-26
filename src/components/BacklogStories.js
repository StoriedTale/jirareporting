// src/components/BacklogStories.js

import React, { useEffect, useState } from 'react';
import { getBacklogStories } from '../jiraClient';
import JIRA_CONFIG from '../jiraConfig';

const BacklogStories = () => {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getBacklogStories(JIRA_CONFIG.JIRA_AEXO_BOARD_ID, JIRA_CONFIG.JIRA_AEXO_PROJECT_KEY);
            setStories(result);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Backlog Stories</h1>
            <ul>
                {stories.map((story, index) => (
                    <li key={story.id}>
                        <strong>Priority:</strong> {index + 1}, <strong>Summary:</strong> {story.fields.summary}, <strong>Parent:</strong> {story.fields.parent ? story.fields.parent.key : 'No Parent'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BacklogStories;