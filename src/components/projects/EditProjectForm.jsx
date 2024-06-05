import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { API_URL } from "../../Api";

const EditProjectForm = ({ show, handleClose, handleEditProject, project }) => {
    const [projectID, setProjectID] = useState(project.projectID);
    const [projectName, setProjectName] = useState(project.projectName);
    const [projectDesc, setProjectDesc] = useState(project.projectDesc);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8; // Number of users per page

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
                    setSelectedUsers(data.members.map(member => member.userID));
                }
            })
            .catch(error => console.error('Error:', error));
    }, [project.id]);

    const handleCheckboxChange = (userID) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userID)) {
                const updatedUsers = prevSelectedUsers.filter(id => id !== userID);
                console.log("Removed user ID:", userID);
                console.log("Updated selected users:", updatedUsers);
                return updatedUsers;
            } else {
                const updatedUsers = [...prevSelectedUsers, userID];
                console.log("Added user ID:", userID);
                console.log("Updated selected users:", updatedUsers);
                return updatedUsers;
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        try {
            console.log("Project ID:", projectID);
            console.log("Selected User IDs:", selectedUsers.map(userID => userID.toString()));

            const response = await fetch(`${API_URL}/projects/assign-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    project_id: projectID,
                    user_ids: selectedUsers.map(userID => userID.toString()), // Convert user IDs to strings
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

    // Calculate the current users to display based on pagination
    const getCurrentPageUsers = () => {
        // Sort users so that project members come first
        const sortedUsers = [
            ...users.filter(user => selectedUsers.includes(user.userID)),
            ...users.filter(user => !selectedUsers.includes(user.userID))
        ];

        // Paginate the sorted users
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentPageUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

        // Divide the users into two columns
        const midIndex = Math.ceil(currentPageUsers.length / 2);
        const column1 = currentPageUsers.slice(0, midIndex);
        const column2 = currentPageUsers.slice(midIndex);

        return { column1, column2 };
    };

    // Handle pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 1 }}>
                                {getCurrentPageUsers().column1.map(user => (
                                    <Form.Check
                                        key={user.userID}
                                        type="checkbox"
                                        label={user.name}
                                        checked={selectedUsers.includes(user.userID)}
                                        onChange={() => handleCheckboxChange(user.userID)}
                                        style={{ marginRight: '10px' }}
                                    />
                                ))}
                            </div>
                            <div style={{ flex: 1 }}>
                                {getCurrentPageUsers().column2.map(user => (
                                    <Form.Check
                                        key={user.userID}
                                        type="checkbox"
                                        label={user.name}
                                        checked={selectedUsers.includes(user.userID)}
                                        onChange={() => handleCheckboxChange(user.userID)}
                                        style={{ marginRight: '10px' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </Form.Group>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                        {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
                            <Button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                variant={i + 1 === currentPage ? 'primary' : 'secondary'}
                                style={{ margin: '0 5px' }}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
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
