import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const NewProjectForm = ({ show, handleClose, handleAddProject }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectName, projectDesc }),
        })
            .then(response => response.json())
            .then(data => {
                handleAddProject(data); // Update projects list with new project
                setProjectName('');
                setProjectDesc('');
                handleClose();
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formProjectName">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formProjectDescription">
                        <Form.Label>Project Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter project description"
                            value={projectDesc}
                            onChange={(e) => setProjectDesc(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default NewProjectForm;