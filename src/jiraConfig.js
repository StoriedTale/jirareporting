// src/jiraConfig.js
import JIRA_API_KEY from './jiraApiKey';


const JIRA_CONFIG = {
    JIRA_URL: 'chewyinc.atlassian.net',
    JIRA_EMAIL: 'cmartin8@chewy.com',
    JIRA_API_KEY: JIRA_API_KEY,
    PROJECTS: [
        { 
            boardId: 1429, projectKey: 'AEXI', name: 'AEXI', type: 'scrum'
        },
        { 
            boardId: 405, projectKey: 'OCS', name: 'OCS', type: 'scrum'
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
            boardId: 1424,  projectKey: 'SAL', name: 'SAL', type: 'scrum'
        },
    ],
};

export default JIRA_CONFIG;