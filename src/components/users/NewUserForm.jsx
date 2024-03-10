import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const NewUserForm = ({ show, handleClose, handleAddUser, roles }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role_id, setRole_id] = useState('');
    const [userID, setUserID] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role_id, userID }),
        })
            .then(response => response.json())
            .then(data => {
                handleAddUser(data); // Update users list with new user
                setName('');
                setEmail('');
                setPassword('');
                setRole_id('');
                setUserID('');
                handleClose();
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

export default NewUserForm;
