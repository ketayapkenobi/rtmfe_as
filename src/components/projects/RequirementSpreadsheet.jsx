import React, { useState, useEffect } from 'react';

function RequirementSpreadsheet() {
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

    useEffect(() => {
        // Get the default height of the textarea
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        setDefaultHeight(textarea.scrollHeight);
        document.body.removeChild(textarea);
    }, []);

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
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.requirementId} onChange={e => handleInputChange(e, row.id, 'requirementId')} style={{ resize: 'none', overflow: 'hidden', minHeight: `${defaultHeight}px`, width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.requirementName} onChange={e => handleInputChange(e, row.id, 'requirementName')} style={{ resize: 'none', overflow: 'hidden', minHeight: `${defaultHeight}px`, width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.description} onChange={e => handleInputChange(e, row.id, 'description')} style={{ resize: 'none', overflow: 'hidden', width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.testCases} onChange={e => handleInputChange(e, row.id, 'testCases')} style={{ resize: 'none', overflow: 'hidden', minHeight: `${defaultHeight}px`, width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                <select value={row.priority} onChange={e => handleInputChange(e, row.id, 'priority')} style={{ borderRadius: '5px', padding: '5px', border: '1px solid #ccc', backgroundColor: '#f7f7f7' }}>
                                    <option value="">Select Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </td>
                            <td style={{ padding: '10px' }}>
                                <select value={row.status} onChange={e => handleInputChange(e, row.id, 'status')} style={{ borderRadius: '5px', padding: '5px', border: '1px solid #ccc', backgroundColor: '#f7f7f7' }}>
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RequirementSpreadsheet;
