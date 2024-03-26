import React, { useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function TestCaseSteps({ show, handleClose, handleAddSteps }) {
    const [steps, setSteps] = useState([
        { id: 1, action: '', input: '', expectedResult: '' }
    ]);

    const handleAdd = () => {
        setSteps(prevSteps => [
            ...prevSteps,
            { id: prevSteps.length + 1, action: '', input: '', expectedResult: '' }
        ]);
    };

    const handleRemove = (id) => {
        setSteps(prevSteps => prevSteps.filter(step => step.id !== id));
    };

    const handleInputChange = (e, id, field) => {
        const { value } = e.target;
        setSteps(prevSteps =>
            prevSteps.map(step =>
                step.id === id ? { ...step, [field]: value } : step
            )
        );
    };

    const handleAddAllSteps = () => {
        steps.forEach(step => {
            if (step.action.trim() !== '' && step.input.trim() !== '' && step.expectedResult.trim() !== '') {
                handleAddSteps(step);
            }
        });
        handleClose();
        setSteps([{ id: 1, action: '', input: '', expectedResult: '' }]);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add Steps</Modal.Title>
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
                        {steps.map(step => (
                            <tr key={step.id}>
                                <td>{step.id}</td>
                                <td><Form.Control type="text" value={step.action} onChange={(e) => handleInputChange(e, step.id, 'action')} /></td>
                                <td><Form.Control type="text" value={step.input} onChange={(e) => handleInputChange(e, step.id, 'input')} /></td>
                                <td><Form.Control type="text" value={step.expectedResult} onChange={(e) => handleInputChange(e, step.id, 'expectedResult')} /></td>
                                <td><Button variant="danger" onClick={() => handleRemove(step.id)}>Remove</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button variant="primary" onClick={handleAdd}>Add Row</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAddAllSteps}>
                    Add All Steps
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TestCaseSteps;
