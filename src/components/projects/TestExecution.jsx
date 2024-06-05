import React, { useState, useEffect } from 'react';
import { Card, Accordion, Table, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

import { API_URL } from "../../Api";

function TestExecution({ projectID }) {
    const [testExecutions, setTestExecutions] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/projects/${projectID}/testexecutions`)
            .then(response => response.json())
            .then(data => setTestExecutions(data.testExecutions))
            .catch(error => console.error('Error:', error));

        fetch(`${API_URL}/current-user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setCurrentUser(data))
            .catch(error => console.error('Error:', error));
    }, [projectID]);

    useEffect(() => {
        if (testExecutions.length > 0) {
            testExecutions.forEach(testExecution => {
                fetch(`${API_URL}/testexecutions/${testExecution.testexecutionID}/progress`)
                    .then(response => response.json())
                    .then(data => {
                        setProgress(prevProgress => {
                            const updatedProgress = [...prevProgress];
                            const existingProgressIndex = updatedProgress.findIndex(progressData => progressData.testexecutionID === testExecution.testexecutionID);
                            if (existingProgressIndex !== -1) {
                                updatedProgress[existingProgressIndex] = { testexecutionID: testExecution.testexecutionID, progress: data.progress, total_percentage: data.total_percentage };
                            } else {
                                updatedProgress.push({ testexecutionID: testExecution.testexecutionID, progress: data.progress, total_percentage: data.total_percentage });
                            }
                            return updatedProgress;
                        });
                    })
                    .catch(error => console.error('Error:', error));
            });
        }
    }, [testExecutions]);

    const getResultText = (resultId) => {
        switch (resultId) {
            case 1:
                return 'To Do';
            case 2:
                return 'In Progress';
            case 3:
                return 'Pass';
            case 4:
                return 'Fail';
            case 5:
                return 'Blocked';
            case 6:
                return 'Passed with Restriction';
            default:
                return '';
        }
    };

    const resultOptions = [
        { id: 1, text: 'To Do', color: '#D3D3D3' }, // Grey color for "To Do"
        { id: 2, text: 'In Progress', color: '#D2E7F3' },
        { id: 3, text: 'Pass', color: '#D2F3D9' },
        { id: 4, text: 'Fail', color: '#F3E2D2' },
        { id: 5, text: 'Blocked', color: '#E2D2F3' },
        { id: 6, text: 'Passed with Restriction', color: '#F3F0D2' }
    ];

    const progressBarColors = {
        1: '#808080', // Grey color for "To Do"
        2: '#3498db ', // In Progress
        3: '#27ae60 ', // Pass
        4: '#e74c3c ', // Fail
        5: '#9b59b6 ', // Blocked
        6: '#f39c12 ', // Passed with Restriction
    };

    const handleResultChange = (index, newValue) => {
        setTestExecutions(prevExecutions => {
            const updatedExecutions = [...prevExecutions];
            updatedExecutions[index].result_id = newValue;
            return updatedExecutions;
        });
    };

    const handleSave = (testexecutionID, stepID, updatedStep) => {
        fetch(`${API_URL}/testexecutions/${testexecutionID}/${stepID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                actual_result: updatedStep.actual_result,
                checked_by: currentUser.userID,
                result_id: updatedStep.result_id
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Test result updated successfully:', data);
                // Display success toast
                toast.success('Test result updated successfully');

                // Update progress bar with current data
                fetch(`${API_URL}/testexecutions/${testexecutionID}/progress`)
                    .then(response => response.json())
                    .then(data => {
                        const { progress, total_percentage } = data;
                        setProgress(prevProgress => {
                            const updatedProgress = [...prevProgress];
                            const existingProgressIndex = updatedProgress.findIndex(progressData => progressData.testexecutionID === testexecutionID);
                            if (existingProgressIndex !== -1) {
                                updatedProgress[existingProgressIndex] = { testexecutionID: testexecutionID, progress: progress, total_percentage: total_percentage };
                            } else {
                                updatedProgress.push({ testexecutionID: testexecutionID, progress: progress, total_percentage: total_percentage });
                            }
                            return updatedProgress;
                        });
                    })
                    .catch(error => console.error('Error:', error));
            })
            .catch(error => {
                console.error('Error:', error);
                // Display error toast
                toast.error('Error updating test result');
            });
    };

    useEffect(() => {
        console.log('Current User:', currentUser);
    }, [currentUser]);

    return (
        <div>
            <ToastContainer />
            <h3>Test Executions</h3>
            {testExecutions.map((testExecution, index) => (
                <Card key={testExecution.id} style={{ marginBottom: '20px' }}>
                    <Card.Body>
                        <Card.Title>Test Execution ID: {testExecution.testexecutionID}</Card.Title>
                        <Card.Text>
                            <strong>Test Plan ID:</strong> {testExecution.testplanID}<br />
                            {/* <strong>Result:</strong>
                            <Form.Select
                                value={testExecution.result_id}
                                onChange={(e) => handleResultChange(index, e.target.value)}
                                style={{
                                    backgroundColor: resultOptions.find(option => option.id == testExecution.result_id).color,
                                    color: 'black'
                                }}
                            >
                                {resultOptions.map(option => (
                                    <option key={option.id} value={option.id} style={{ backgroundColor: option.color, color: 'black' }}>{option.text}</option>
                                ))}
                            </Form.Select>
                            <br /> */}
                            <strong>Progress:</strong>
                            {progress
                                .filter(progressData => progressData.testexecutionID === testExecution.testexecutionID)
                                .map(progressData => (
                                    <div key={progressData.testexecutionID}>
                                        <div>Total Progress: {progressData.total_percentage.toFixed(2)}%</div>
                                        <div className="progress" style={{ height: '20px', marginTop: '5px' }}>
                                            {progressData.progress.map(progressItem => (
                                                <div
                                                    key={progressItem.result_id}
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{
                                                        width: `${progressItem.percentage}%`,
                                                        backgroundColor: progressBarColors[progressItem.result_id] || '#000000', // Default color if result_id not found
                                                        color: 'black'
                                                    }}
                                                    aria-valuenow={progressItem.percentage}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            <strong>Number of Execution:</strong> {testExecution.number_of_execution}<br />
                            <Accordion>
                                {Object.keys(testExecution.testcase_id).map(testcaseID => (
                                    <Accordion.Item eventKey={testcaseID} key={testcaseID}>
                                        <Accordion.Header>Test Case ID: {testcaseID}</Accordion.Header>
                                        <Accordion.Body>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Action</th>
                                                        <th>Input</th>
                                                        <th>Expected Result</th>
                                                        <th>Actual Result</th>
                                                        <th>Checked By</th>
                                                        <th>Result ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {testExecution.testcase_id[testcaseID].steps.map((step, stepIndex) => (
                                                        <tr key={stepIndex}>
                                                            <td>{step.action}</td>
                                                            <td>{step.input}</td>
                                                            <td>{step.expected_result}</td>
                                                            <td>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={3}
                                                                    value={step.actual_result}
                                                                    onChange={(e) => {
                                                                        const updatedStep = { ...step, actual_result: e.target.value };
                                                                        const updatedSteps = [...testExecution.testcase_id[testcaseID].steps];
                                                                        updatedSteps[stepIndex] = updatedStep;

                                                                        setTestExecutions(prevExecutions => {
                                                                            const updatedExecutions = [...prevExecutions];
                                                                            updatedExecutions[index].testcase_id[testcaseID].steps = updatedSteps;
                                                                            return updatedExecutions;
                                                                        });
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>{step.checked_by.userID} - {step.checked_by.userName}</td>
                                                            <td>
                                                                <Form.Select
                                                                    value={step.result_id}
                                                                    onChange={(e) => {
                                                                        const updatedStep = { ...step, result_id: e.target.value };
                                                                        const updatedSteps = [...testExecution.testcase_id[testcaseID].steps];
                                                                        updatedSteps[stepIndex] = updatedStep;

                                                                        setTestExecutions(prevExecutions => {
                                                                            const updatedExecutions = [...prevExecutions];
                                                                            updatedExecutions[index].testcase_id[testcaseID].steps = updatedSteps;
                                                                            return updatedExecutions;
                                                                        });
                                                                    }}
                                                                    style={{
                                                                        backgroundColor: resultOptions.find(option => option.id == step.result_id).color,
                                                                        color: 'black'
                                                                    }}
                                                                >
                                                                    {resultOptions.map(option => (
                                                                        <option key={option.id} value={option.id} style={{ backgroundColor: option.color, color: 'black' }}>{option.text}</option>
                                                                    ))}
                                                                </Form.Select>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary d-inline-flex align-items-center"
                                                                    style={{
                                                                        borderRadius: '4px',
                                                                        padding: '5px 10px',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '14px',
                                                                        textTransform: 'uppercase',
                                                                        boxShadow: 'none',
                                                                        transition: 'background-color 0.3s',
                                                                        cursor: 'pointer',
                                                                        border: 'none', // Ensure no border is applied
                                                                        outline: 'none', // Ensure no outline is applied
                                                                    }}
                                                                    onClick={() => {
                                                                        console.log('Test Execution ID:', testExecution.testexecutionID);
                                                                        handleSave(testExecution.testexecutionID, step.step_id, step);
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencil} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))
            }
        </div >
    );
}

export default TestExecution;
