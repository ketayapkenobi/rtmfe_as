import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
        const { value } = e.target;
        setRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId ? { ...row, [field]: value } : row
            )
        );

        // Wait for the state to update and then calculate the tallest cell height
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
    };

    const addRow = () => {
        setRows(prevRows => [
            ...prevRows,
            {
                id: prevRows.length + 1,
                requirementId: projectID ? `${projectID}-R${prevRows.length + 1}` : '',
                requirementName: '',
                description: '',
                priority: '',
                testCases: '',
                status: ''
            }
        ]);
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
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id} style={{ backgroundColor: '#fff', color: '#212529', borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>{row.id}</td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>{row.requirementId}</td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.requirementName} onChange={e => handleInputChange(e, row.id, 'requirementName')} style={{ resize: 'none', overflow: 'hidden', minHeight: `${defaultHeight}px`, width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.description} onChange={e => handleInputChange(e, row.id, 'description')} style={{ resize: 'none', overflow: 'hidden', width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.testCases} onChange={e => handleInputChange(e, row.id, 'testCases')} style={{ resize: 'none', overflow: 'hidden', minHeight: `${defaultHeight}px`, width: '100%', border: 'none', outline: 'none' }} /></td>
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
