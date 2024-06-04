import React, { useState, useEffect } from 'react';
import { Button, Container, ListGroup, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import NewUserForm from './NewUserForm'; // Import the NewUserForm component
import EditUserForm from './EditUserForm'; // Import the EditUserForm component
import ViewUserModal from './ViewUserModal'; // Import the ViewUserModal component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock function to check if a user is logged in
// Replace this with your actual authentication logic
const isUserLoggedIn = () => {
    return !!localStorage.getItem('token');
};

function Users() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showViewUserModal, setShowViewUserModal] = useState(false);
    const [roles, setRoles] = useState([]); // State to store roles
    const [userRole, setUserRole] = useState(null); // State to store user's role
    const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for editing
    const [viewedUser, setViewedUser] = useState(null); // State to store the user being viewed
    const navigate = useNavigate();

    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate('/auth/sign-in');
        }

        const authToken = localStorage.getItem('token');
        fetch('http://localhost:8000/api/current-user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setUserRole(data.role))
            .catch(error => console.error('Error:', error));

        fetch('http://localhost:8000/api/users')
            .then(response => response.json())
            .then(data => setUsers(data.users))
            .catch(error => console.error('Error:', error));

        fetch('http://localhost:8000/api/roles') // Fetch roles data
            .then(response => response.json())
            .then(data => setRoles(data.roles))
            .catch(error => console.error('Error:', error));
    }, [navigate]);

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

    const handleCloseNewUserModal = () => {
        setShowNewUserModal(false);
    };

    const handleShowNewUserModal = () => {
        setShowNewUserModal(true);
    };

    const handleEditUser = (updatedUser) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        setTimeout(() => {
            toast.success('Team Member edited successfully!');
        }, 1000); // Adjust the delay time as needed
    };

    const handleDeleteUser = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) {
            return; // If the user cancels, do nothing
        }

        fetch(`http://localhost:8000/api/users/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                return response.json();
            })
            .then(data => {
                setUsers(users.filter(user => user.id !== id));
                toast.success(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error(error.message);
            });
    };

    const handleCloseEditUserModal = () => {
        setShowEditUserModal(false);
        setSelectedUser(null); // Reset selected user after closing the modal
    };

    const handleShowEditUserModal = (user) => {
        setSelectedUser(user); // Set the selected user for editing
        setShowEditUserModal(true); // Open the modal for editing
    };

    const handleCloseViewUserModal = () => {
        setShowViewUserModal(false);
        setViewedUser(null); // Reset viewed user after closing the modal
    };

    const handleShowViewUserModal = (user) => {
        console.log('Selected User:', user); // Log the user object to check if it contains projects
        setViewedUser(user); // Set the user being viewed
        setShowViewUserModal(true); // Open the modal for viewing
    };

    return (
        <Container fluid className="p-0">
            <ToastContainer />
            {userRole === 'Project Manager' && (
                <Button variant="primary" className="float-end mt-n1" onClick={handleShowNewUserModal}>
                    <FontAwesomeIcon icon={faUserPlus} /> New team member
                </Button>
            )}
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
                                    {userRole === 'Project Manager' && (
                                        <>
                                            <Button variant="primary" className="ms-2" onClick={() => handleShowViewUserModal(user)}>
                                                <FontAwesomeIcon icon={faEye} /> View
                                            </Button>
                                            <Button variant="warning" className="ms-2" onClick={() => handleShowEditUserModal(user)}>
                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDeleteUser(user.id)} className="ms-2">
                                                <FontAwesomeIcon icon={faTrash} /> Delete
                                            </Button>
                                        </>
                                    )}
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

            <NewUserForm show={showNewUserModal} handleClose={handleCloseNewUserModal} handleAddUser={handleAddUser} roles={roles} />
            {selectedUser && (
                <EditUserForm
                    show={showEditUserModal}
                    handleClose={handleCloseEditUserModal}
                    handleEditUser={handleEditUser}
                    user={selectedUser}
                    roles={roles}
                />
            )}
            {viewedUser && (
                <ViewUserModal
                    show={showViewUserModal}
                    handleClose={handleCloseViewUserModal}
                    user={viewedUser}
                />
            )}
        </Container>
    );
}

export default Users;
