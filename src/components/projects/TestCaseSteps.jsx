import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Table } from 'react-bootstrap';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function TestCaseSteps({ show, handleClose, testcaseID }) {
    const [steps, setSteps] = useState([]);
    const [newStep, setNewStep] = useState({
        action: '',
        input: '',
        expected_result: ''
    });
    const [editStep, setEditStep] = useState(null);

    const handleEditStep = (index) => {
        setEditStep(index);
    };

    const handleEditChange = (e, stepIndex, fieldName) => {
        const { value } = e.target;
        setSteps(prevSteps => {
            const updatedSteps = [...prevSteps];
            const editedStep = { ...updatedSteps[stepIndex], [fieldName]: value };
            updatedSteps[stepIndex] = editedStep;
            return updatedSteps;
        });
    };

    useEffect(() => {
        if (!testcaseID) return;

        fetch(`http://localhost:8000/api/steps/${testcaseID}`)
            .then(response => response.json())
            .then(data => {
                setSteps(data || []); // Assuming data is an array
            })
            .catch(error => console.error('Error fetching steps:', error));
    }, [testcaseID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStep(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddStep = () => {
        const stepOrder = steps.length + 1;

        fetch(`http://localhost:8000/api/steps`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                testcase_id: testcaseID,
                step_order: stepOrder,
                ...newStep
            })
        })
            .then(response => response.json())
            .then(data => {
                setSteps([...steps, data]);
                setNewStep({
                    action: '',
                    input: '',
                    expected_result: ''
                });
            })
            .catch(error => console.error('Error adding step:', error));
    };

    const handleSaveEdit = (step, stepOrder) => {
        console.log('Step order:', stepOrder);
        console.log('Test case ID:', testcaseID);

        const editedStep = steps[editStep]; // Access the correct step using editStep

        const requestData = {
            testcase_id: testcaseID,
            action: editedStep.action,
            input: editedStep.input,
            expected_result: editedStep.expected_result,
            step_order: stepOrder
        };

        console.log('Data being sent to update API:', requestData);

        fetch(`http://localhost:8000/api/steps/${testcaseID}/${stepOrder}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => {
                const updatedSteps = steps.map((s, index) => {
                    if (index === editStep) {
                        return {
                            ...s,
                            ...editedStep
                        };
                    }
                    return s;
                });
                setSteps(updatedSteps);
                setEditStep(null); // Exit edit mode
            })
            .catch(error => console.error('Error updating step:', error));
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Test Case Steps - {testcaseID}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Action</th>
                            <th>Input</th>
                            <th>Expected Result</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {steps.map((step, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{editStep === index ? (
                                    <Form.Control
                                        type="text"
                                        value={step.action}
                                        onChange={(e) => handleEditChange(e, index, 'action')}
                                    />
                                ) : (
                                    step.action
                                )}</td>
                                <td>{editStep === index ? (
                                    <Form.Control
                                        type="text"
                                        value={step.input}
                                        onChange={(e) => handleEditChange(e, index, 'input')}
                                    />
                                ) : (
                                    step.input
                                )}</td>
                                <td>{editStep === index ? (
                                    <Form.Control
                                        type="text"
                                        value={step.expected_result}
                                        onChange={(e) => handleEditChange(e, index, 'expected_result')}
                                    />
                                ) : (
                                    step.expected_result
                                )}</td>
                                <td>{editStep === index ? (
                                    <Button variant="success" onClick={() => handleSaveEdit(step, step.step_order)}>Save</Button>
                                ) : (
                                    <Button variant="primary" onClick={() => handleEditStep(index)}>Edit</Button>
                                )}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <h4>Add New Step:</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Input</th>
                            <th>Expected Result</th>
                            <th></th> {/* Empty column for the Add button */}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter action"
                                    name="action"
                                    value={newStep.action}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter input"
                                    name="input"
                                    value={newStep.input}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter expected result"
                                    name="expected_result"
                                    value={newStep.expected_result}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <Button variant="primary" onClick={handleAddStep}>
                                    Add Step
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TestCaseSteps;
