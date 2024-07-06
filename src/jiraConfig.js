// src/jiraConfig.js
import JIRA_API_KEY from './jiraApiKey';


const JIRA_CONFIG = {
    JIRA_URL: 'chewyinc.atlassian.net',
    JIRA_EMAIL: 'cmartin8@chewy.com',
    JIRA_API_KEY: JIRA_API_KEY,
    PROJECTS: [
        { 
            boardId: 1429, projectKey: 'AEXI', name: 'AEXI', type: 'kanban',
            Statuses: [
                {value: 'Backlog', label: 'Prioritized Strategic (OP1/A-List)', priority: 1},
            ],
        },
        { 
            boardId: 405, projectKey: 'OCS', name: 'OCS', type: 'scrum',
            Statuses: [
                {value: 'To Do', label: 'To Do', priority: 4},
                {value: 'In Progress', label: 'Development', priority: 3},
                {value: 'Ready Dev Test', label: 'Automated Testing', priority: 2},
                {value: 'Dev Test', label: 'Code Review', priority: 1},
            ]
        },
        { 
            boardId: 3362, projectKey: 'AEXO', name: 'AEXO', type: 'kanban', velocity: 4, default_pts: 2,
            Statuses: [
                {value: 'Backlog', label: 'CS+ Backlog', priority: 4},
                {value: 'In Progress', label: 'In Progress', priority: 3},
                {value: 'In UAT', label: 'In UAT', priority: 2},
                {value: 'CR Scheduled', label: 'CR Scheduled', priority: 1}
            ],
        },
        { 
            boardId: 1424,  projectKey: 'SAL', name: 'SAL', type: 'scrum',
            Statuses: [
                {value: 'To Do', label: 'To Do', priority: 2},
                {value: 'In Progress', label: 'In Progress', priority: 1}
            ]
        },
    ],
};

export default JIRA_CONFIG;