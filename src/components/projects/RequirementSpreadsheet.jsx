import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Table } from 'react-bootstrap';

import { API_URL } from "../../Api";

function RequirementSpreadsheet({ projectID }) {
    const [rows, setRows] = useState(Array.from({ length: 3 }, (_, index) => ({
        id: index + 1,
        requirementId: '',
        requirementName: '',
        description: '',
        priority: '',
        testCases: '',
        status: ''
    })));
    const [defaultHeight, setDefaultHeight] = useState(0);
    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');
    const [editedRows, setEditedRows] = useState([]);
    const [maxRequirementNumber, setMaxRequirementNumber] = useState(0);
    const [savedRows, setSavedRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem('token');
        // Get the default height of the textarea
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        setDefaultHeight(textarea.scrollHeight);
        document.body.removeChild(textarea);

        // Fetch current user's role
        fetch(`${API_URL}/current-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setUserRole(data.role);    // Set the user role
                setUserId(data.id);    // Set the user ID
            })
            .catch(error => console.error('Error fetching current user role:', error));

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
        fetch(`${API_URL}/projects/${projectID}/requirements`)
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
                    status: requirement.status_name,
                    created_by: requirement.created_by,
                    updated_by: requirement.updated_by,
                    created_at: requirement.created_at,
                    updated_at: requirement.updated_at
                })));

                const maxNumber = data.maxRequirementNumber;
                console.log(maxNumber);
                setMaxRequirementNumber(maxNumber);

                // Add fetched requirements to savedRows
                setSavedRows(data.requirements.map(req => req.requirementID));
            })
            .catch(error => console.error('Error:', error));

        // Fetch priorities
        fetch(`${API_URL}/priority`)
            .then(response => response.json())
            .then(data => setPriorities(data.priorities))
            .catch(error => console.error('Error:', error));

        // Fetch statuses
        fetch(`${API_URL}/status`)
            .then(response => response.json())
            .then(data => setStatuses(data.statuses))
            .catch(error => console.error('Error:', error));
    }, [projectID]);

    const handleInputChange = (e, rowId, field) => {
        if (userRole === 'Client') return; // Check user's role and return if Client

        const { value } = e.target;
        setRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId ? { ...row, [field]: value } : row
            )
        );

        setTimeout(() => {
            const currentRow = e.target.parentNode.parentNode;
            const cells = currentRow.querySelectorAll('td textarea');
            const tallestCellHeight = Math.max(...Array.from(cells).map(cell => cell.scrollHeight));

            // Set the minimum height to the default height
            const minHeight = defaultHeight;
            const newHeight = tallestCellHeight > minHeight ? tallestCellHeight : minHeight;

            // Apply the new height to all cells in the current row
            cells.forEach(cell => cell.style.height = `${newHeight}px`);

            // Reset the height to default if the value is empty
            if (value.trim() === '') {
                cells.forEach(cell => cell.style.height = `${defaultHeight}px`);
            }
        }, 0);

        // Check if the row is already marked as edited
        if (!editedRows.includes(rowId)) {
            setEditedRows([...editedRows, rowId]);
        }
    };

    const isRowEdited = (rowId) => {
        return editedRows.includes(rowId);
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
        fetch(`${API_URL}/requirements/check/${requirementID}`)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    // If the requirement ID exists, update the requirement
                    fetch(`${API_URL}/requirements/${requirementID}`, {
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
                            userId: userId
                        }),
                    })
                        .then(() => {
                            toast.success('Requirement updated successfully');
                            // Remove the row ID from the editedRows state
                            setEditedRows(prevEditedRows => prevEditedRows.filter(id => id !== rowId));
                        })
                        .catch(error => console.error('Error updating requirement:', error));
                } else {
                    // If the requirement ID doesn't exist, proceed with creating the requirement
                    fetch(`${API_URL}/requirements`, {
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
                            userId: userId
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
                            // Change the color of the button to blue
                            setRows(prevRows =>
                                prevRows.map(r =>
                                    r.id === rowId ? { ...r, isNew: true } : r
                                )
                            );
                            // Remove the row ID from the editedRows state
                            setEditedRows(prevEditedRows => prevEditedRows.filter(id => id !== rowId));
                            // Add the row ID to savedRows
                            setSavedRows(prevSavedRows => [...prevSavedRows, requirementID]);
                        })
                        .catch(error => console.error('Error creating requirement:', error));
                }
            })
            .catch(error => console.error('Error checking requirement ID:', error));
    };

    const addRow = () => {
        const newRequirementNumber = maxRequirementNumber + 1;
        const formattedRequirementNumber = String(newRequirementNumber).padStart(2, '0');
        const newRow = {
            id: rows.length + 1,
            requirementId: projectID ? `${projectID}-R${formattedRequirementNumber}` : '',
            requirementName: '',
            description: '',
            priority: '',
            testCases: '',
            status: ''
        };
        setRows(prevRows => [...prevRows, newRow]);

        // Mark the newly added row as edited
        setEditedRows([...editedRows, newRow.id]);

        setMaxRequirementNumber(newRequirementNumber);
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

    const handleDeleteClick = (rowId) => {
        const row = rows.find((r) => r.id === rowId);
        if (!row) return;

        const requirementID = row.requirementId;

        // Display confirmation message
        if (window.confirm('Are you sure you want to delete this requirement?')) {
            fetch(`${API_URL}/requirements/${requirementID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    if (response.ok) {
                        toast.success('Requirement deleted successfully');
                        // Remove the row from the rows state
                        setRows(prevRows => prevRows.filter(row => row.id !== rowId));
                        // Remove the row ID from the savedRows state
                        setSavedRows(prevSavedRows => prevSavedRows.filter(id => id !== requirementID));
                    } else {
                        toast.error('Failed to delete requirement');
                    }
                })
                .catch(error => console.error('Error deleting requirement:', error));
        }
    };

    const openModal = (requirement) => {
        setSelectedRequirement(requirement);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequirement(null);
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
                        {userRole !== 'Client' && <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Action</th>}
                        {userRole == 'Client' && <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}></th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id} style={{ backgroundColor: '#fff', color: '#212529', borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>{row.id}</td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>{row.requirementId}</td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                <textarea
                                    value={row.requirementName}
                                    onChange={e => handleInputChange(e, row.id, 'requirementName')}
                                    disabled={userRole === 'Client'}
                                    style={{
                                        resize: 'none', overflow: 'hidden', minHeight: `${defaultHeight}px`,
                                        width: '100%', border: 'none', outline: 'none', backgroundColor: userRole === 'Client' ? '#f0f0f0' : 'transparent'
                                    }}
                                />
                            </td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                <textarea
                                    value={row.description}
                                    onChange={e => handleInputChange(e, row.id, 'description')}
                                    disabled={userRole === 'Client'}
                                    style={{
                                        resize: 'none', overflow: 'hidden', width: '100%', border: 'none', outline: 'none',
                                        backgroundColor: userRole === 'Client' ? '#f0f0f0' : 'transparent'
                                    }}
                                />
                            </td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                {(Array.isArray(row.testCases) ? row.testCases.join(',') : row.testCases)
                                    .split(',')
                                    .map((testCase, index) => (
                                        <button key={index} style={{ borderRadius: '20px', padding: '5px 10px', marginRight: '5px', marginBottom: '5px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', cursor: 'pointer' }}>{testCase}</button>
                                    ))}
                            </td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                <select
                                    value={row.priority}
                                    onChange={e => handleInputChange(e, row.id, 'priority')}
                                    disabled={userRole === 'Client'}
                                    style={{
                                        borderRadius: '5px', padding: '5px', border: '1px solid #ccc',
                                        backgroundColor: userRole === 'Client' ? '#f0f0f0' : '#f7f7f7', ...getPriorityColor(row.priority)
                                    }}
                                >
                                    <option value="">Select Priority</option>
                                    {priorities.map(priority => (
                                        <option key={priority.id} value={priority.name} style={{ color: 'black', backgroundColor: getPriorityColor(priority.name).backgroundColor }}>{priority.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                <select
                                    value={row.status}
                                    onChange={e => handleInputChange(e, row.id, 'status')}
                                    disabled={userRole === 'Client'}
                                    style={{
                                        borderRadius: '5px', padding: '5px', border: '1px solid #ccc',
                                        backgroundColor: userRole === 'Client' ? '#f0f0f0' : '#f7f7f7', ...getStatusColor(row.status)
                                    }}
                                >
                                    <option value="">Select Status</option>
                                    {statuses.map(status => (
                                        <option key={status.id} value={status.name} style={{ color: 'black', backgroundColor: getStatusColor(status.name).backgroundColor }}>{status.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                {userRole !== 'Client' && (
                                    <>
                                        <button
                                            onClick={() => handleTickClick(row.id)}
                                            title="Save"
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer',
                                                color: isRowEdited(row.id) ? 'orange' : '#007bff',
                                                fontSize: '1.5em',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                backgroundColor: '#f0f0f0',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                marginRight: '5px',
                                                marginBottom: '5px'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPencil} />
                                        </button>
                                        {savedRows.includes(row.requirementId) && (
                                            <>
                                                <button
                                                    onClick={() => handleDeleteClick(row.id)}
                                                    title="Delete"
                                                    style={{
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        color: '#9c0000', // Dark red color
                                                        fontSize: '1.5em',
                                                        padding: '5px 10px',
                                                        borderRadius: '5px',
                                                        backgroundColor: '#f0f0f0',
                                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                        marginRight: '5px'
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                                <button
                                                    onClick={() => openModal(row)}
                                                    title="Contributors Info"
                                                    style={{
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        color: '#9fc5e8',
                                                        fontSize: '1.5em',
                                                        padding: '5px 10px',
                                                        borderRadius: '5px',
                                                        backgroundColor: '#f0f0f0',
                                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addRow} style={{ fontSize: '20px', borderRadius: '50%', padding: '5px 10px', marginLeft: '10px', marginTop: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <ToastContainer />
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Contributors Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequirement && (
                        <Table bordered>
                            <tbody>
                                <tr>
                                    <td><strong>Requirement ID</strong></td>
                                    <td>{selectedRequirement.requirementId}</td>
                                </tr>
                                <tr>
                                    <td><strong>Created By</strong></td>
                                    <td>{selectedRequirement.created_by}</td>
                                </tr>
                                <tr>
                                    <td><strong>Created At</strong></td>
                                    <td>{selectedRequirement.created_at}</td>
                                </tr>
                                <tr>
                                    <td><strong>Updated By</strong></td>
                                    <td>{selectedRequirement.updated_by}</td>
                                </tr>
                                <tr>
                                    <td><strong>Updated At</strong></td>
                                    <td>{selectedRequirement.updated_at}</td>
                                </tr>
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RequirementSpreadsheet;
