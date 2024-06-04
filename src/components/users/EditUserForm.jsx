import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EditUserForm = ({ show, handleClose, handleEditUser, user, roles }) => {
    const [name, setName] = useState(user ? user.name : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [role_id, setRole_id] = useState(user ? user.role_id : '');
    const [userID, setUserID] = useState(user ? user.userID : '');
    const [error, setError] = useState('');
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        const payload = {
            name,
            email,
            role_id,
            userID
        };

        if (showPasswordSection) {
            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }

        // Proceed with form submission
        fetch(`http://localhost:8000/api/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                handleEditUser(data); // Update users list with edited user
                setName('');
                setEmail('');
                setRole_id('');
                setUserID('');
                setCurrentPassword('');
                setNewPassword('');
                setShowPasswordSection(false);
                handleClose();
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formRole_id">
                        <Form.Label>Role ID</Form.Label>
                        <Form.Control
                            as="select"
                            value={role_id}
                            onChange={(e) => setRole_id(e.target.value)}
                            required
                        >
                            <option value="">Select role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formUserID">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter user ID"
                            value={userID}
                            onChange={(e) => setUserID(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="link" onClick={() => setShowPasswordSection(!showPasswordSection)}>
                        {showPasswordSection ? 'Hide' : 'Change Password'}
                    </Button>

                    {showPasswordSection && (
                        <>
                            <Form.Group controlId="formCurrentPassword">
                                <Form.Label>Current Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </>
                    )}

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

export default EditUserForm;
