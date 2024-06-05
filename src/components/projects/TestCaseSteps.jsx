import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

import { API_URL } from "../../Api";

function TestCaseSteps({ show, handleClose, testcaseID }) {
    const [steps, setSteps] = useState([]);
    const [maxStepOrder, setMaxStepOrder] = useState(0);
    const [newStep, setNewStep] = useState({
        action: '',
        input: '',
        expected_result: ''
    });
    const [editStep, setEditStep] = useState(null);
    const defaultHeight = 40; // Set your default height here

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
        adjustTextareaHeight(e);
    };

    const adjustTextareaHeight = (e) => {
        setTimeout(() => {
            const currentRow = e.target.parentNode.parentNode;
            const cells = currentRow.querySelectorAll('textarea');
            const tallestCellHeight = Math.max(...Array.from(cells).map(cell => cell.scrollHeight));

            const newHeight = tallestCellHeight > defaultHeight ? tallestCellHeight : defaultHeight;

            cells.forEach(cell => {
                if (e.target.value.trim() === '') {
                    cell.style.height = `${defaultHeight}px`;
                } else {
                    cell.style.height = `${newHeight}px`;
                }
            });
        }, 0);
    };

    useEffect(() => {
        if (!testcaseID) return;

        fetch(`${API_URL}/steps/${testcaseID}`)
            .then(response => response.json())
            .then(data => {
                setSteps(data.steps || []);
                setMaxStepOrder(data.maxStepOrder || 0);
            })
            .catch(error => console.error('Error fetching steps:', error));
    }, [testcaseID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStep(prevState => ({
            ...prevState,
            [name]: value
        }));
        adjustTextareaHeight(e);
    };

    const handleAddStep = () => {
        const stepOrder = maxStepOrder + 1;

        fetch(`${API_URL}/steps`, {
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
                setMaxStepOrder(stepOrder);
            })
            .catch(error => console.error('Error adding step:', error));
    };

    const handleSaveEdit = (step, stepOrder) => {
        const editedStep = steps[editStep];

        const requestData = {
            testcase_id: testcaseID,
            action: editedStep.action,
            input: editedStep.input,
            expected_result: editedStep.expected_result,
            step_order: stepOrder
        };

        fetch(`${API_URL}/steps/${testcaseID}/${stepOrder}`, {
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
                setEditStep(null);
            })
            .catch(error => console.error('Error updating step:', error));
    };

    const handleDeleteStep = (stepOrder) => {
        fetch(`${API_URL}/steps/${testcaseID}/${stepOrder}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                const updatedSteps = steps.filter(step => step.step_order !== stepOrder);
                setSteps(updatedSteps);
            })
            .catch(error => console.error('Error deleting step:', error));
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {steps.map((step, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{editStep === index ? (
                                    <Form.Control
                                        as="textarea"
                                        value={step.action}
                                        onChange={(e) => handleEditChange(e, index, 'action')}
                                        style={{ resize: 'none', overflow: 'hidden' }}
                                    />
                                ) : (
                                    step.action
                                )}</td>
                                <td>{editStep === index ? (
                                    <Form.Control
                                        as="textarea"
                                        value={step.input}
                                        onChange={(e) => handleEditChange(e, index, 'input')}
                                        style={{ resize: 'none', overflow: 'hidden' }}
                                    />
                                ) : (
                                    step.input
                                )}</td>
                                <td>{editStep === index ? (
                                    <Form.Control
                                        as="textarea"
                                        value={step.expected_result}
                                        onChange={(e) => handleEditChange(e, index, 'expected_result')}
                                        style={{ resize: 'none', overflow: 'hidden' }}
                                    />
                                ) : (
                                    step.expected_result
                                )}</td>
                                <td className="d-flex flex-column">
                                    {editStep === index ? (
                                        <Button
                                            variant="success"
                                            onClick={() => handleSaveEdit(step, step.step_order)}
                                            className="mb-2"
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleEditStep(index)}
                                            className="mb-2"
                                        >
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteStep(step.step_order)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter action"
                                    name="action"
                                    value={newStep.action}
                                    onChange={handleInputChange}
                                    style={{ resize: 'none', overflow: 'hidden', height: `${defaultHeight}px` }}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter input"
                                    name="input"
                                    value={newStep.input}
                                    onChange={handleInputChange}
                                    style={{ resize: 'none', overflow: 'hidden', height: `${defaultHeight}px` }}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter expected result"
                                    name="expected_result"
                                    value={newStep.expected_result}
                                    onChange={handleInputChange}
                                    style={{ resize: 'none', overflow: 'hidden', height: `${defaultHeight}px` }}
                                />
                            </td>
                            <td>
                                <Button variant="primary" onClick={handleAddStep}>
                                    <FontAwesomeIcon icon={faPlus} />
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
