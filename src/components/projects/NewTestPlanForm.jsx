import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';

import { API_URL } from "../../Api";

function NewTestPlanForm({ projectID, show, onHide, onSubmit }) {
    const [newTestPlan, setNewTestPlan] = useState({
        name: '',
        description: '',
        priority_id: '',
        status_id: '',
        testplanID: `${projectID}-TP`,
        selectedTestCases: []
    });
    const [latestTestPlanNumber, setLatestTestPlanNumber] = useState('');
    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        if (show) {
            fetch(`${API_URL}/testplans/${projectID}`)
                .then(response => response.json())
                .then(data => {
                    const latestNumber = parseInt(data, 10) + 1;
                    setLatestTestPlanNumber(latestNumber);
                    setNewTestPlan(prevState => ({
                        ...prevState,
                        testplanID: `${projectID}-TP${latestNumber < 10 ? `0${latestNumber}` : latestNumber}`
                    }));
                })
                .catch(error => console.error('Error:', error));

            fetch(`${API_URL}/projects/${projectID}/testcases`)
                .then(response => response.json())
                .then(data => {
                    console.log('Test cases data:', data);
                    if (Array.isArray(data.testcases)) {
                        setTestCases(data.testcases);
                    } else {
                        console.error('Test cases data is not an array:', data);
                    }
                })
                .catch(error => console.error('Error:', error));

        }
    }, [projectID, show]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTestPlan(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleTestCaseChange = (testCaseID) => {
        const isSelected = newTestPlan.selectedTestCases.includes(testCaseID);
        if (isSelected) {
            setNewTestPlan(prevState => ({
                ...prevState,
                selectedTestCases: prevState.selectedTestCases.filter(id => id !== testCaseID)
            }));
        } else {
            setNewTestPlan(prevState => ({
                ...prevState,
                selectedTestCases: [...prevState.selectedTestCases, testCaseID]
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            testplanID: newTestPlan.testplanID,
            name: newTestPlan.name,
            description: newTestPlan.description,
            priority_id: newTestPlan.priority_id,
            status_id: newTestPlan.status_id,
            project_id: projectID,
            test_cases: newTestPlan.selectedTestCases // Assuming testCaseID format is 'P01-TC{ID}'
        };

        // API call to create the test plan
        fetch(`${API_URL}/testplans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Reset the form fields
                setNewTestPlan({
                    name: '',
                    description: '',
                    priority_id: '',
                    status_id: '',
                    testplanID: `${projectID}-TP${latestTestPlanNumber < 10 ? `0${latestTestPlanNumber}` : latestTestPlanNumber}`,
                    selectedTestCases: []
                });
                // Call the onSubmit prop to inform the parent component
                onSubmit(data);

                // API call to relate test cases to the test plan
                fetch(`${API_URL}/testplans/${formData.testplanID}/assign-testcases`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ testcase_ids: formData.test_cases })
                })
                    .then(response => response.json())
                    .then(data => console.log('Related test cases:', data))
                    .catch(error => console.error('Error relating test cases:', error));
            })
            .catch(error => {
                console.error('Error creating test plan:', error);
                // Handle any error states or display error messages
            });
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Create Test Plan - {projectID}-TP{latestTestPlanNumber < 10 ? `0${latestTestPlanNumber}` : latestTestPlanNumber}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTestPlanID">
                        <Form.Label>Test Plan ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Test Plan ID"
                            name="testplanID"
                            value={newTestPlan.testplanID}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={newTestPlan.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Enter description"
                            name="description"
                            value={newTestPlan.description}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPriority">
                        <Form.Label>Priority</Form.Label>
                        <Form.Control
                            as="select"
                            name="priority_id"
                            value={newTestPlan.priority_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select priority</option>
                            <option value="1">High</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status_id"
                            value={newTestPlan.status_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select status</option>
                            <option value="1">To Do</option>
                            <option value="2">In Progress</option>
                            <option value="3">Done</option>
                        </Form.Control>
                    </Form.Group>
                    <hr />
                    <h5>Test Cases:</h5>
                    <ListGroup>
                        {testCases.map(testCase => (
                            <ListGroup.Item key={testCase.id}>
                                <Form.Check
                                    type="checkbox"
                                    id={`testcase-${testCase.id}`}
                                    label={`${testCase.testcaseID} - ${testCase.name}`}
                                    checked={newTestPlan.selectedTestCases.includes(testCase.testcaseID)}
                                    onChange={() => handleTestCaseChange(testCase.testcaseID)}
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>Create</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default NewTestPlanForm;

