import React, { useState, useEffect } from 'react';
import { Form, Card, Button, Modal, ListGroup } from 'react-bootstrap';
import NewTestPlanForm from './NewTestPlanForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { API_URL } from "../../Api";

function TestPlan({ projectID }) {
    const [testPlans, setTestPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [relatedTestCases, setRelatedTestCases] = useState([]);
    const [selectedTestPlanID, setSelectedTestPlanID] = useState(null);
    const [allTestCases, setAllTestCases] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/projects/${projectID}/testplans`)
            .then(response => response.json())
            .then(data => setTestPlans(data.testPlans))
            .catch(error => console.error('Error:', error));

        fetch(`${API_URL}/projects/${projectID}/testcases`)
            .then(response => response.json())
            .then(data => setAllTestCases(data.testcases))
            .catch(error => console.error('Error:', error));
    }, [projectID]);

    const handleCreateTestPlan = (newTestPlan) => {
        setTestPlans([...testPlans, newTestPlan]);
        setShowModal(false);
    };

    const handleDeleteTestPlan = (testplanID) => {
        const confirmed = window.confirm(`Are you sure you want to delete test plan with ID ${testplanID}?`);
        if (!confirmed) {
            return;
        }

        fetch(`${API_URL}/testplans/${testplanID}`, {
            method: 'DELETE',
        })
            .then(() => {
                setTestPlans(prevTestPlans => prevTestPlans.filter(testPlan => testPlan.testplanID !== testplanID));
            })
            .catch(error => console.error('Error:', error));
    };

    const handleShowRelatedTestCases = (testplanID) => {
        fetch(`${API_URL}/testplans/${testplanID}/related-testcases`)
            .then(response => response.json())
            .then(data => {
                setRelatedTestCases(data.relatedTestCases);
                setSelectedTestPlanID(testplanID);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleSaveRelatedTestCases = () => {
        fetch(`${API_URL}/testplans/${selectedTestPlanID}/assign-testcases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ testcase_ids: relatedTestCases })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response:', data);
                // Optionally, you can update the UI or show a message
                setSelectedTestPlanID(null);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleExecuteTestPlan = (testplanID) => {
        console.log(testplanID);
        fetch(`${API_URL}/testplans/${testplanID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                console.log('Test plan executed successfully:', data);
                toast.success('Test plan executed successfully');
                // Optionally, you can update the UI or show a message
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h3>Test Plans</h3>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={() => setShowModal(true)}>Create Test Plan</Button>
            </div>

            <NewTestPlanForm
                projectID={projectID}
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleCreateTestPlan}
            />

            {testPlans.map(testPlan => (
                <Card key={testPlan.id} style={{ marginBottom: '10px' }}>
                    <Card.Body>
                        <Card.Title>{testPlan.name} - {testPlan.testplanID} </Card.Title>
                        <Card.Text>{testPlan.description}</Card.Text>
                        <Card.Text><strong>Number of Execution: </strong>{testPlan.execution_count}</Card.Text>
                        <Card.Text><strong>Priority:</strong> {testPlan.priority_name}</Card.Text>
                        <Card.Text><strong>Status:</strong> {testPlan.status_name}</Card.Text>
                        <Button variant="primary" onClick={() => handleShowRelatedTestCases(testPlan.testplanID)} style={{ marginRight: '5px' }}>Test Cases</Button>
                        <Button variant="danger" onClick={() => handleDeleteTestPlan(testPlan.testplanID)}>Delete</Button>
                        <Button variant="success" onClick={() => handleExecuteTestPlan(testPlan.testplanID)} style={{ marginLeft: '5px' }}>Execute</Button>
                    </Card.Body>
                </Card>
            ))}

            <Modal show={selectedTestPlanID !== null} onHide={() => setSelectedTestPlanID(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Related Test Cases</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>All Test Cases in Project</h5>
                    <ListGroup>
                        {allTestCases.map(testCase => (
                            <ListGroup.Item key={testCase.id}>
                                <Form.Check
                                    type="checkbox"
                                    label={`${testCase.testcaseID} - ${testCase.name}`}
                                    checked={relatedTestCases.includes(testCase.testcaseID)}
                                    onChange={() => {
                                        if (relatedTestCases.includes(testCase.testcaseID)) {
                                            setRelatedTestCases(relatedTestCases.filter(id => id !== testCase.testcaseID));
                                        } else {
                                            setRelatedTestCases([...relatedTestCases, testCase.testcaseID]);
                                        }
                                    }}
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedTestPlanID(null)}>Close</Button>
                    <Button variant="primary" onClick={handleSaveRelatedTestCases}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TestPlan;
