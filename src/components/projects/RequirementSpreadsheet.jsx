import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RequirementSpreadsheet({ projectID }) {
    const [rows, setRows] = useState([]);
    const [defaultHeight, setDefaultHeight] = useState(0);
    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        // Get the default height of the textarea
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        setDefaultHeight(textarea.scrollHeight);
        document.body.removeChild(textarea);

        // Generate initial rows based on projectID
        setRows(Array.from({ length: 3 }, (_, index) => ({
            id: index + 1,
            requirementId: projectID ? `${projectID}-R${index + 1}` : '',
            requirementName: '',
            description: '',
            priority: '',
            testCases: '',
            status: ''
        })));

        // Fetch requirements
        fetch(`http://localhost:8000/api/projects/${projectID}/requirements`)
            .then(response => response.json())
            .then(data => {
                // Update the rows with fetched requirements
                setRows(data.requirements.map((requirement, index) => ({
                    id: index + 1,
                    requirementId: requirement.requirementID,
                    requirementName: requirement.name,
                    description: requirement.description,
                    priority: requirement.priority_name,
                    testCases: requirement.testCases,
                    status: requirement.status_name
                })));
            })
            .catch(error => console.error('Error:', error));

        // Fetch priorities
        fetch('http://localhost:8000/api/priority')
            .then(response => response.json())
            .then(data => setPriorities(data.priorities))
            .catch(error => console.error('Error:', error));

        // Fetch statuses
        fetch('http://localhost:8000/api/status')
            .then(response => response.json())
            .then(data => setStatuses(data.statuses))
            .catch(error => console.error('Error:', error));
    }, [projectID]);

    const handleInputChange = (e, rowId, field) => {
        // console.log('Row ID:', rowId);
        const { value } = e.target;
        setRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId ? { ...row, [field]: value } : row
            )
        );
    };

    const priorityMap = {
        'High': 1,
        'Medium': 2,
        'Low': 3
    };

    const statusMap = {
        'To Do': 1,
        'In Progress': 2,
        'Done': 3
    };

    const handleTickClick = (rowId) => {
        const row = rows.find((r) => r.id === rowId);
        if (!row) return;

        const requirementID = row.requirementId;
        if (!requirementID) {
            console.error('Requirement ID is empty');
            return;
        }

        // Check if the requirement ID already exists
        fetch(`http://localhost:8000/api/requirements/check/${requirementID}`)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    // If the requirement ID exists, update the requirement
                    fetch(`http://localhost:8000/api/requirements/${requirementID}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            requirementID: requirementID,
                            name: row.requirementName,
                            description: row.description,
                            priority_id: priorityMap[row.priority],
                            status_id: statusMap[row.status],
                            project_id: projectID,
                        }),
                    })
                        .then(() => {
                            toast.success('Requirement updated successfully');
                        })
                        .catch(error => console.error('Error updating requirement:', error));
                } else {
                    // If the requirement ID doesn't exist, proceed with creating the requirement
                    fetch('http://localhost:8000/api/requirements', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            requirementID: requirementID,
                            name: row.requirementName,
                            description: row.description,
                            priority_id: priorityMap[row.priority],
                            status_id: statusMap[row.status],
                            project_id: projectID,
                        }),
                    })
                        .then(response => response.json())
                        .then(() => {
                            // Update the rows with the newly created requirement
                            setRows(prevRows =>
                                prevRows.map(r =>
                                    r.id === rowId ? { ...r, requirementId: requirementID } : r
                                )
                            );
                            toast.success('Requirement created successfully');
                        })
                        .catch(error => console.error('Error creating requirement:', error));
                }
            })
            .catch(error => console.error('Error checking requirement ID:', error));
    };



    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            requirementId: projectID ? `${projectID}-R${rows.length + 1}` : '',
            requirementName: '',
            description: '',
            priority: '',
            testCases: '',
            status: ''
        };
        setRows(prevRows => [...prevRows, newRow]);
    };


    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return { color: 'black', backgroundColor: '#ffd1dc' }; // Pastel pink
            case 'Medium':
                return { color: 'black', backgroundColor: '#fffdcf' }; // Pastel yellow
            case 'Low':
                return { color: 'black', backgroundColor: '#b2d8d8' }; // Pastel blue
            default:
                return { color: 'black', backgroundColor: 'transparent' };
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do':
                return { color: 'black', backgroundColor: '#b2d8d8' }; // Pastel blue
            case 'In Progress':
                return { color: 'black', backgroundColor: '#fffdcf' }; // Pastel yellow
            case 'Done':
                return { color: 'black', backgroundColor: '#c1f8c1' }; // Pastel green
            default:
                return { color: 'black', backgroundColor: 'transparent' };
        }
    };

    return (
        <div>
            <ToastContainer />
            <table style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                    <tr style={{ backgroundColor: '#f8f9fa', color: '#212529' }}>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>ID</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Requirement ID</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Requirement Name</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6', width: '30%' }}>Description</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Test Cases</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Test Priority</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Status</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Action</th>

                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id} style={{ backgroundColor: '#fff', color: '#212529', borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>{row.id}</td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>{row.requirementId}</td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.requirementName} onChange={e => handleInputChange(e, row.id, 'requirementName')} style={{ resize: 'none', overflow: 'hidden', minHeight: `${defaultHeight}px`, width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.description} onChange={e => handleInputChange(e, row.id, 'description')} style={{ resize: 'none', overflow: 'hidden', width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                {(Array.isArray(row.testCases) ? row.testCases.join(',') : row.testCases)
                                    .split(',')
                                    .map((testCase, index) => (
                                        <button key={index} style={{ borderRadius: '20px', padding: '5px 10px', marginRight: '5px', marginBottom: '5px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', cursor: 'pointer' }}>{testCase}</button>
                                    ))}
                            </td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                <select value={row.priority} onChange={e => handleInputChange(e, row.id, 'priority')} style={{ borderRadius: '5px', padding: '5px', border: '1px solid #ccc', backgroundColor: '#f7f7f7', ...getPriorityColor(row.priority) }}>
                                    <option value="">Select Priority</option>
                                    {priorities.map(priority => (
                                        <option key={priority.id} value={priority.name} style={{ color: 'black', backgroundColor: getPriorityColor(priority.name).backgroundColor }}>{priority.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                <select value={row.status} onChange={e => handleInputChange(e, row.id, 'status')} style={{ borderRadius: '5px', padding: '5px', border: '1px solid #ccc', backgroundColor: '#f7f7f7', ...getStatusColor(row.status) }}>
                                    <option value="">Select Status</option>
                                    {statuses.map(status => (
                                        <option key={status.id} value={status.name} style={{ color: 'black', backgroundColor: getStatusColor(status.name).backgroundColor }}>{status.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                <button onClick={() => handleTickClick(row.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#333', fontSize: '1.5em', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <FontAwesomeIcon icon={faPencil} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addRow} style={{ fontSize: '20px', borderRadius: '50%', padding: '5px 10px', marginLeft: '10px', marginTop: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
}

export default RequirementSpreadsheet;
