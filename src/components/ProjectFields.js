import React, { useEffect, useState } from 'react';
import { getMostRecentIssue, getFieldsMetadata, getIssueDetails } from '../jiraClient';
import JIRA_CONFIG from '../jiraConfig';
import './ProjectFields.css'; // Import the CSS file

const ProjectFields = ({ selectedProject }) => {
    const [issue, setIssue] = useState(null);
    const [fieldsMetadata, setFieldsMetadata] = useState({});
    const [queryType, setQueryType] = useState('mostRecent');
    const [issueKey, setIssueKey] = useState('');

    const handleQueryTypeChange = (event) => {
        setQueryType(event.target.value);
        setIssue(null);
    };

    const handleIssueKeyChange = (event) => {
        setIssueKey(event.target.value);
    };

    const handleQuery = async () => {
        if (queryType === 'enterKey' && issueKey) {
            const issueDetails = await getIssueDetails(issueKey);
            setIssue(issueDetails);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (selectedProject && queryType === 'mostRecent') {
                const recentIssue = await getMostRecentIssue(selectedProject.projectKey);
                setIssue(recentIssue);
            }
            const metadata = await getFieldsMetadata();
            const metadataMap = metadata.reduce((acc, field) => {
                acc[field.id] = field.name;
                return acc;
            }, {});
            setFieldsMetadata(metadataMap);
        };

        if (selectedProject && queryType === 'mostRecent') {
            fetchData();
        }
    }, [selectedProject, queryType]);

    const renderValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        return typeof value === 'object' ? JSON.stringify(value) : value;
    };

    return (
        <div className="styled-table-container">
            <h1>Project Fields</h1>
            <div>
                <label>
                    <input
                        type="radio"
                        value="mostRecent"
                        checked={queryType === 'mostRecent'}
                        onChange={handleQueryTypeChange}
                    />
                    Most Recent Issue
                </label>
                <label>
                    <input
                        type="radio"
                        value="enterKey"
                        checked={queryType === 'enterKey'}
                        onChange={handleQueryTypeChange}
                    />
                    Enter Issue Key
                </label>
                {queryType === 'enterKey' && (
                    <div>
                        <input
                            type="text"
                            value={issueKey}
                            onChange={handleIssueKeyChange}
                            placeholder="Enter Issue Key"
                        />
                        <button onClick={handleQuery}>Query</button>
                    </div>
                )}
            </div>
            {issue && (
                <table className="styled-table">
                    <tbody>
                        {Object.entries(issue.fields).map(([key, value]) => (
                            <tr key={key}>
                                <td className="key-column"><strong>{fieldsMetadata[key] || key}</strong></td>
                                <td className="value-column">{renderValue(value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProjectFields;