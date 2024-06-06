import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import Select from 'react-select';

import { API_URL } from "../../Api";

const NewProjectForm = ({ show, handleClose, handleAddProject }) => {
    const [projectID, setProjectID] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/users`)
            .then(response => response.json())
            .then(data => setUsers(data.users))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(selectedUsers);
        setError(''); // Reset error message

        const selectedUserIDs = selectedUsers.map(user => user.value);
        console.log(selectedUserIDs);

        // Check if projectID already exists
        fetch(`${API_URL}/projects/check/${projectID}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    throw new Error('Project ID already exists');
                } else {
                    // Project ID does not exist, proceed with form submission
                    return fetch(`${API_URL}/projects`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ projectID, projectName, projectDesc, selectedUsers: selectedUserIDs }),
                    });
                }
            })
            .then(response => response.json())
            .then(data => {
                handleAddProject(data); // Update projects list with new project
                setProjectID('');
                setProjectName('');
                setProjectDesc('');
                setSelectedUsers([]);
                handleClose();
            })
            .catch(error => setError(error.message));
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group controlId="formProjectID">
                        <Form.Label>Project ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter project ID"
                            value={projectID}
                            onChange={(e) => setProjectID(e.target.value)}
                            required
                        />
                    </Form.Group>
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
                    <Form.Group controlId="formSelectedUsers">
                        <Form.Label>Assign users to this project:</Form.Label>
                        <Select
                            options={users.map(user => ({
                                value: user.id,
                                label: user.name
                            }))}
                            isMulti
                            value={selectedUsers}
                            onChange={setSelectedUsers}
                            classNamePrefix="react-select"
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
