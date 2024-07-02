// src/components/ProjectFields.js

import React, { useEffect, useState } from 'react';
import { getMostRecentIssue, getFieldsMetadata } from '../jiraClient';
import JIRA_CONFIG from '../jiraConfig';
import './ProjectFields.css'; // Import the CSS file

const ProjectFields = ({ selectedProject }) => {
    const [issue, setIssue] = useState(null);
    const [fieldsMetadata, setFieldsMetadata] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const recentIssue = await getMostRecentIssue(selectedProject.projectKey);
            setIssue(recentIssue);

            const metadata = await getFieldsMetadata();
            const metadataMap = metadata.reduce((acc, field) => {
                acc[field.id] = field.name;
                return acc;
            }, {});
            setFieldsMetadata(metadataMap);
        };

        fetchData();
    }, [selectedProject]);

    if (!issue) {
        return <div>Loading...</div>;
    }

    const fields = issue.fields;
    const standardFields = {};
    const customFields = {};

    // Separate standard fields and custom fields
    Object.entries(fields).forEach(([key, value]) => {
        if (key.startsWith('customfield_')) {
            customFields[key] = value;
        } else {
            standardFields[key] = value;
        }
    });

    const renderValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        return typeof value === 'object' ? JSON.stringify(value) : value;
    };

    return (
        <div className="styled-table-container">
            <h1>Most Recent Issue Fields</h1>
            <table className="styled-table">
                <tbody>
                    {Object.entries(standardFields).map(([key, value]) => (
                        <tr key={key}>
                            <td className="key-column"><strong>{key}</strong></td>
                            <td className="value-column">{renderValue(value)}</td>
                        </tr>
                    ))}
                    {Object.entries(customFields).map(([key, value]) => (
                        <tr key={key}>
                            <td className="key-column"><strong>{fieldsMetadata[key] || key} ({key})</strong></td>
                            <td className="value-column">{renderValue(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectFields;
