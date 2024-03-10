import React, { useState, useEffect } from 'react';
import { Button, Container, ListGroup, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import NewUserForm from './NewUserForm'; // Import the NewUserForm component

function Users() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [roles, setRoles] = useState([]); // State to store roles

    useEffect(() => {
        fetch('http://localhost:8000/api/users')
            .then(response => response.json())
            .then(data => setUsers(data.users))
            .catch(error => console.error('Error:', error));

        fetch('http://localhost:8000/api/roles') // Fetch roles data
            .then(response => response.json())
            .then(data => setRoles(data.roles))
            .catch(error => console.error('Error:', error));
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAddUser = (newUser) => {
        // Find the role object for the new user
        const role = roles.find(r => r.id === newUser.role_id);
        // Add the role_name property to the new user object
        newUser.role_name = role ? role.name : '';
        // Update the users list with the new user
        setUsers(prevUsers => [...prevUsers, newUser]);
    };


    const handleClose = () => {
        setShowModal(false);
    };

    const handleShow = () => setShowModal(true);

    return (
        <Container fluid className="p-0">
            <Button variant="primary" className="float-end mt-n1" onClick={handleShow}>
                <FontAwesomeIcon icon={faUserPlus} /> New team member
            </Button>
            <h1 className="h3 mb-3">Team Members</h1>

            <ListGroup>
                {currentUsers.map((user, index) => {
                    const userIndex = indexOfFirstUser + index + 1; // Calculate the user index based on the current page
                    return (
                        <ListGroup.Item key={user.id}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{userIndex}. {user.name}</h5>
                                    <p style={{ marginBottom: '0.5rem' }}>{user.role_name}</p>
                                    <p style={{ marginBottom: '0.5rem' }}>User ID: {user.userID}</p>
                                </div>
                                <div>
                                    <Button variant="warning" className="me-2">
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </Button>
                                    <Button variant="danger">
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </Button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>



            <Pagination>
                {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <NewUserForm show={showModal} handleClose={handleClose} handleAddUser={handleAddUser} roles={roles} />
        </Container>
    );
}

export default Users;
