import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

import { API_URL } from "../../Api";

const EditProjectForm = ({ show, handleClose, handleEditProject, project }) => {
    const [projectID, setProjectID] = useState(project.projectID);
    const [projectName, setProjectName] = useState(project.projectName);
    const [projectDesc, setProjectDesc] = useState(project.projectDesc);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        // Fetch all users
        fetch(`${API_URL}/users`)
            .then(response => response.json())
            .then(data => {
                console.log("Users data:", data); // Debugging line
                if (Array.isArray(data.users)) {
                    setUsers(data.users);
                }
            })
            .catch(error => console.error('Error:', error));

        // Fetch current project members
        fetch(`${API_URL}/projects/${project.id}/members`)
            .then(response => response.json())
            .then(data => {
                console.log("Project members:", data); // Debugging line
                if (Array.isArray(data.members)) {
                    setSelectedUsers(data.members.map(member => ({
                        value: member.userID,
                        label: member.name
                    })));
                }
            })
            .catch(error => console.error('Error:', error));
    }, [project.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        try {
            console.log("Project ID:", projectID);
            console.log("Selected User IDs:", selectedUsers.map(user => user.value));

            const response = await fetch(`${API_URL}/projects/assign-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    project_id: projectID,
                    user_ids: selectedUsers.map(user => user.value.toString()), // Convert user IDs to strings
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to assign users to project');
            }
            handleEditProject(project.id, { projectID, projectName, projectDesc, selectedUsers });
            handleClose();
            toast.success('Users assigned to project successfully');
        } catch (error) {
            setError(error.message);
            toast.error('Failed to assign users to project');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ToastContainer />
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
                                value: user.userID,
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

export default EditProjectForm;
