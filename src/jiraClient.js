// src/jiraClient.js

import axios from 'axios';
import JIRA_CONFIG from './jiraConfig';

const jiraClient = axios.create({
    baseURL: '/rest/api/2', // Use the proxy
    auth: {
        username: JIRA_CONFIG.JIRA_EMAIL,
        password: JIRA_CONFIG.JIRA_API_KEY
    },
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getBacklogStories = async (boardId, projectKey) => {
    try {
        const jqlQuery = `project = ${projectKey} AND issuetype = Story ORDER BY priority`;
        const maxResults = 100;
        let startAt = 0;
        let issues = [];
        let response;

        do {
            response = await jiraClient.get('/search', {
                params: {
                    jql: jqlQuery,
                    startAt,
                    maxResults,
                    fields: ['summary', 'parent', 'priority']
                }
            });

            issues = issues.concat(response.data.issues);
            startAt += maxResults;
        } while (startAt < response.data.total);

        return issues;
    } catch (error) {
        console.error('Error fetching backlog stories:', error);
        return [];
    }
};