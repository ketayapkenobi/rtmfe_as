import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ViewUserModal({ show, handleClose, user }) {
    // Log the user object to check if projects are present
    console.log('User:', user);
    console.log('Projects:', user ? user.projects : 'No user');

    // Ensure user and user.projects are defined before attempting to map
    const projects = user && user.projects ? user.projects : [];

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {user ? (
                    <>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>User ID:</strong> {user.userID}</p>
                        {/* <p><strong>Projects:</strong></p>
                        <ul>
                            {projects.map((project, index) => (
                                <li key={index}>{project}</li>
                            ))}
                        </ul> */}
                    </>
                ) : (
                    <p>No user data available.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewUserModal;
