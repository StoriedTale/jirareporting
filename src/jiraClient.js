// src/jiraClient.js

import axios from 'axios';
import JIRA_CONFIG from './jiraConfig';

const jiraClient = axios.create({
    baseURL: `/rest/api/latest`,
    auth: {
        username: JIRA_CONFIG.JIRA_EMAIL,
        password: JIRA_CONFIG.JIRA_API_KEY
    },
    headers: {
        'Content-Type': 'application/json'
    }
});

const jiraAgileClient = axios.create({
    baseURL: `/rest/agile/1.0`, // Use the Agile API for boards and sprints
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
        const jqlQuery = `project = ${projectKey} ORDER BY priority`;
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
            
            //console.log(response);

            issues = issues.concat(response.data.issues);
            startAt += maxResults;
        } while (startAt < /* response.data.total */ 200);

        return issues;
    } catch (error) {
        console.error('Error fetching backlog stories:', error);
        return [];
    }
};

export const getMostRecentIssue = async (projectKey) => {
    try {
        const jqlQuery = `project = ${projectKey} ORDER BY created DESC`;
        const response = await jiraClient.get('/search', {
            params: {
                jql: jqlQuery,
                startAt: 0,
                maxResults: 1
            }
        });

        return response.data.issues[0];
    } catch (error) {
        console.error('Error fetching the most recent issue:', error);
        return null;
    }
};

export const getFieldsMetadata = async () => {
    try {
        const response = await jiraClient.get('/field');
        return response.data;
    } catch (error) {
        console.error('Error fetching fields metadata:', error);
        return [];
    }
};

export const getSprintsForBoard = async (boardId) => {
    let startAt = 0;
    const maxResults = 50;
    let allSprints = [];
    let total = 0;

    do {
        const response = await jiraAgileClient.get(`/board/${boardId}/sprint`, {
            params: {
                startAt,
                maxResults
            }
        });

        const { values, total: totalItems } = response.data;
        allSprints = allSprints.concat(values);
        total = totalItems;
        startAt += maxResults;
    } while (startAt < total);

    return allSprints;
};

export const getIssuesFromBoardBacklog = async (boardId) => {
    try {
        const response = await jiraAgileClient.get(`/board/${boardId}/backlog`);
        return response.data.issues;
    } catch (error) {
        console.error('Error fetching issues from board backlog:', error);
        return [];
    }
};

export const getIssuesForKanbanBoard = async (projectKey, statuses) => {
    try {
        const jqlQuery = `project = ${projectKey} AND status IN (${statuses.map(status => `"${status}"`).join(", ")}) ORDER BY Rank`;
        const response = await jiraClient.get('/search', {
            params: {
                jql: jqlQuery,
                startAt: 0,
                maxResults: 100, // Adjust the maxResults as needed
                fields: ['summary', 'parent', 'priority', 'status', 'rank', 'customfield_10004'] // Adjust the fields as needed
            }
        });

        return response.data.issues;
    } catch (error) {
        console.error('Error fetching issues for Kanban board:', error);
        return [];
    }
};

export const getIssueDetails = async (issueKey) => {
    try {
        const response = await jiraClient.get(`/issue/${issueKey}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching issue details:', error);
        return null;
    }
};