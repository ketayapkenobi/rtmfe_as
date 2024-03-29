import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TestCaseSteps from './TestCaseSteps';
import RelateRequirementsModal from './RelateRequirementsModal';


function TestCasesSpreadsheet({ projectID }) {
    const [rows, setRows] = useState([]);
    const [defaultHeight, setDefaultHeight] = useState(0);
    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [steps, setSteps] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [showStepsModal, setShowStepsModal] = useState(false);
    const [showRequirementsModal, setShowRequirementsModal] = useState(false);
    const [selectedTestCaseID, setSelectedTestCaseID] = useState(null);
    const [selectedRequirements, setSelectedRequirements] = useState([]);

    useEffect(() => {
        // Get the default height of the textarea
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        setDefaultHeight(textarea.scrollHeight);
        document.body.removeChild(textarea);

        // Generate initial rows and steps based on projectID
        setRows(Array.from({ length: 3 }, (_, index) => ({
            id: index + 1,
            testCaseId: projectID ? `${projectID}-TC${index + 1}` : '',
            testCaseName: '',
            description: '',
            steps: '',
            requirements: '',
            priority: '',
            status: '',
            // selectedRequirements: [] // Initialize selectedRequirements as an empty array
        })));

        setSteps(Array.from({ length: 3 }, (_, index) => ({
            id: index + 1,
            testCaseId: projectID ? `${projectID}-TC${index + 1}` : '',
            stepNumber: '',
            description: ''
        })));

        // Fetch test cases
        fetch(`http://localhost:8000/api/projects/${projectID}/testcases`)
            .then(response => response.json())
            .then(data => {
                // Update the rows with fetched requirements
                setRows(data.testcases.map((testcase, index) => ({
                    id: index + 1,
                    testCaseId: testcase.testcaseID,
                    testCaseName: testcase.name,
                    description: testcase.description,
                    requirements: testcase.requirements,
                    priority: testcase.priority_name,
                    status: testcase.status_name
                })));
            })
            .catch(error => console.error('Error:', error));

        // Fetch requirements
        fetch(`http://localhost:8000/api/projects/${projectID}/requirements`)
            .then(response => response.json())
            .then(data => setRequirements(data.requirements))
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


    const handleSelectRequirements = (testcaseID, selectedRequirements) => {
        setSelectedTestCaseID(testcaseID);
        setSelectedRequirements(selectedRequirements);
        setShowRequirementsModal(true);
    };

    const updateRequirements = (testcaseID, selectedRequirements) => {
        setRows(prevRows =>
            prevRows.map(row =>
                row.testCaseId === testcaseID ? { ...row, requirements: selectedRequirements } : row
            )
        );
    };

    // const handleRequirementsModalClose = () => {
    //     setShowRequirementsModal(false);
    // };

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

        const testcaseID = row.testCaseId;
        if (!testcaseID) {
            console.error('Test Case ID is empty');
            return;
        }

        const requirementIDs = Array.isArray(row.requirements) ? row.requirements : [];
        console.log('Requirement IDs:', requirementIDs);

        // Check if the requirement ID already exists
        fetch(`http://localhost:8000/api/testcases/check/${testcaseID}`)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    // Update existing test case
                    fetch(`http://localhost:8000/api/testcases/${testcaseID}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            testcaseID: testcaseID,
                            name: row.testCaseName,
                            description: row.description,
                            priority_id: priorityMap[row.priority],
                            status_id: statusMap[row.status],
                            project_id: projectID,
                        }),
                    })
                        .then(() => {
                            toast.success('Test case updated successfully');
                            relateRequirements(testcaseID, requirementIDs);
                        })
                        .catch(error => console.error('Error updating test case:', error));
                } else {
                    // Create new test case
                    fetch('http://localhost:8000/api/testcases', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            testcaseID: testcaseID,
                            name: row.testCaseName,
                            description: row.description,
                            priority_id: priorityMap[row.priority],
                            status_id: statusMap[row.status],
                            project_id: projectID,
                        }),
                    })
                        .then(response => response.json())
                        .then(() => {
                            toast.success('Test Case created successfully');
                            relateRequirements(testcaseID, requirementIDs);
                        })
                        .catch(error => console.error('Error creating test case:', error));
                }
            })
            .catch(error => console.error('Error checking requirement ID:', error));

        // Function to relate requirements to a test case
        const relateRequirements = (testcaseID, requirementIDs) => {
            fetch(`http://localhost:8000/api/testcases/${testcaseID}/relate-requirements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requirement_ids: requirementIDs,
                }),
            })
                .then(() => {
                    console.log('Requirements related successfully');
                })
                .catch(error => console.error('Error relating requirements:', error));
        };
    };

    const addRow = () => {
        setRows(prevRows => [
            ...prevRows,
            {
                id: prevRows.length + 1,
                testCaseId: projectID ? `${projectID}-TC${prevRows.length + 1}` : '',
                testCaseName: '',
                description: '',
                priority: '',
                status: ''
            }
        ]);

        setSteps(prevSteps => [
            ...prevSteps,
            {
                id: prevSteps.length + 1,
                testCaseId: projectID ? `${projectID}-TC${prevSteps.length + 1}` : '',
                stepNumber: '',
                description: ''
            }
        ]);
    };

    const handleAddSteps = (testCaseId) => {
        setSelectedTestCaseID(testCaseId);
        setShowStepsModal(true);
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
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Test Case ID</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Test Case Name</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6', width: '30%' }}>Description</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Steps</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Requirements</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Priority</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Status</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id} style={{ backgroundColor: '#fff', color: '#212529', borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>{row.id}</td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>{row.testCaseId}</td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.testCaseName} onChange={e => handleInputChange(e, row.id, 'testCaseName')} style={{ resize: 'none', overflow: 'hidden', minHeight: `${defaultHeight}px`, width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}><textarea value={row.description} onChange={e => handleInputChange(e, row.id, 'description')} style={{ resize: 'none', overflow: 'hidden', width: '100%', border: 'none', outline: 'none' }} /></td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6', position: 'relative', minHeight: `${defaultHeight}px` }}>
                                <div style={{ position: 'relative' }}>
                                    <textarea value={row.steps} onChange={e => handleInputChange(e, row.id, 'steps')} style={{ resize: 'none', overflow: 'hidden', width: '100%', border: 'none', outline: 'none', pointerEvents: 'none', backgroundColor: '#f7f7f7', color: '#212529', minHeight: `${defaultHeight}px` }} />
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => handleAddSteps(row.testCaseId)}
                                        style={{
                                            position: 'absolute',
                                            bottom: '5px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            // fontWeight: 'bold',
                                            lineHeight: '1.5',
                                            borderRadius: '25px',
                                            color: '##000000',
                                            background: '#aed9e0', // pastel blue
                                            border: 'none',
                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s, transform 0.3s',
                                        }}
                                    >
                                        Steps
                                    </Button>


                                </div>
                            </td>
                            <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                                {(Array.isArray(row.requirements) ? row.requirements.join(',') : row.requirements || '')
                                    .split(',')
                                    .map((requirement, index) => (
                                        <button key={index} style={{ borderRadius: '20px', padding: '5px 10px', marginRight: '5px', marginBottom: '5px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', cursor: 'pointer' }}>{requirement}</button>
                                    ))}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    {row.selectedRequirements && row.selectedRequirements.map(req => (
                                        <span key={req.id}>{req.requirementID}</span>
                                    ))}
                                    <Button variant="link" onClick={() => handleSelectRequirements(row.testCaseId, row.requirements)}>
                                        Select Requirements <FontAwesomeIcon icon={faChevronDown} />
                                    </Button>
                                </div>
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
            {showStepsModal && (
                <TestCaseSteps
                    show={showStepsModal}
                    handleClose={() => setShowStepsModal(false)}
                    handleAddSteps={handleAddSteps}
                    testcaseID={selectedTestCaseID}
                />
            )}
            {showRequirementsModal && (
                <RelateRequirementsModal
                    show={showRequirementsModal}
                    handleClose={() => setShowRequirementsModal(false)}
                    requirements={requirements}
                    testcaseID={selectedTestCaseID}
                    updateRequirements={updateRequirements}
                    selectedRequirements={selectedRequirements}
                />
            )}
            <button onClick={addRow} style={{ fontSize: '20px', borderRadius: '50%', padding: '5px 10px', marginLeft: '10px', marginTop: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
}

export default TestCasesSpreadsheet;