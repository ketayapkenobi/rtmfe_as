import React, { useState } from 'react';

function RequirementSpreadsheet() {
    const [rows, setRows] = useState([
        { id: 1, requirementId: '', requirementName: '', description: '', priority: '', testCases: '', status: '' },
        { id: 2, requirementId: '', requirementName: '', description: '', priority: '', testCases: '', status: '' },
        { id: 3, requirementId: '', requirementName: '', description: '', priority: '', testCases: '', status: '' },
        // Add more rows as needed
    ]);

    const handleCellChange = (e, rowId, field) => {
        const updatedRows = rows.map(row =>
            row.id === rowId ? { ...row, [field]: e.target.value } : row
        );
        setRows(updatedRows);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Requirement ID</th>
                        <th>Requirement Name</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Test Cases</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>
                                <input
                                    type="text"
                                    value={row.requirementId}
                                    onChange={e => handleCellChange(e, row.id, 'requirementId')}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.requirementName}
                                    onChange={e => handleCellChange(e, row.id, 'requirementName')}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.description}
                                    onChange={e => handleCellChange(e, row.id, 'description')}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.priority}
                                    onChange={e => handleCellChange(e, row.id, 'priority')}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.testCases}
                                    onChange={e => handleCellChange(e, row.id, 'testCases')}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.status}
                                    onChange={e => handleCellChange(e, row.id, 'status')}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RequirementSpreadsheet;
