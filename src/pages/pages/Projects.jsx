import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Col, Container, ListGroup, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import Project from '../../components/projects/Projects'; // Importing the Project component
import NewProjectForm from '../../components/projects/NewProjectForm';
import EditProjectForm from '../../components/projects/EditProjectForm';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem('token');
      try {
        // Fetch current user role
        const userResponse = await fetch('http://localhost:8000/api/current-user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserRole(userData.role);

          let projectsResponse;
          if (userData.role === 'Project Manager') {
            // Fetch all projects for project managers
            projectsResponse = await fetch('http://localhost:8000/api/projects', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
            });
          } else {
            // Fetch projects for the current user
            projectsResponse = await fetch(`http://localhost:8000/api/projects/current-user/${userData.userID}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
            });
          }

          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json();
            setProjects(projectsData);
          } else {
            console.error('Failed to fetch projects');
          }
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setShowEditModal(false);
    setEditProject(null);
    setShowDeleteModal(false);
    setDeleteProject(null);
  };

  const handleShow = () => setShowModal(true);

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleEditProject = (id, updatedProject) => {
    fetch(`http://localhost:8000/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
    })
      .then(response => response.json())
      .then(data => {
        const updatedProjects = projects.map(project => {
          if (project.id === id) {
            return { ...project, ...updatedProject };
          }
          return project;
        });
        setProjects(updatedProjects);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleOpenEditModal = (project) => {
    setEditProject(project);
    setShowEditModal(true);
  };

  const handleDeleteProject = (project) => {
    setDeleteProject(project);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:8000/api/projects/${deleteProject.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedProjects = projects.filter(project => project.id !== deleteProject.id);
        setProjects(updatedProjects);
        handleClose();
      })
      .catch(error => console.error('Error:', error));
  };

  const cardStyle = {
    border: '1px solid #e3e6f0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%', // Ensure all cards are of equal height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  };

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#343a40',
  };

  const cardBodyStyle = {
    fontSize: '0.875rem',
    color: '#6c757d',
    flex: '1 1 auto', // Ensure the card body takes up remaining space
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const cardFooterStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const buttonStyle = {
    margin: '0 5px',
    fontSize: '0.875rem',
    borderRadius: '5px',
  };

  return (
    <Container fluid className="p-0">
      <Button variant="primary" className="float-end mt-n1" onClick={handleShow} style={{ display: userRole === 'Project Manager' ? 'block' : 'none' }}>
        <FontAwesomeIcon icon={faPlus} /> New project
      </Button>
      <h1 className="h3 mb-3">Projects</h1>

      <Row>
        {projects.map(project => (
          <Col key={project.id} md="6" lg="4" xl="3" className="mb-4">
            <Card style={{ ...cardStyle, ':hover': cardHoverStyle }}>
              {project.image && <Card.Img src={project.image} alt="Card image cap" />}
              <Card.Header className="px-4 pt-4">
                <Card.Title style={cardTitleStyle}>{project.projectName}</Card.Title>
                <Badge className="my-2" bg="primary">
                  {project.state}
                </Badge>
              </Card.Header>
              <Card.Body className="px-4 pt-2" style={cardBodyStyle}>
                <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.projectDesc}</p>
              </Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-4 pb-4">
                  <p className="mb-2 fw-bold">
                    {/* Progress<span className="float-end">{project.percentage}%</span> */}
                  </p>
                  {/* <ProgressBar className="progress-sm" now={project.percentage} /> */}
                </ListGroup.Item>
              </ListGroup>
              <Card.Footer style={cardFooterStyle}>
                <Link to={`/pages/project/${project.id}`} className="btn btn-info" style={{ ...buttonStyle, backgroundColor: '#17a2b8', color: '#fff' }}>
                  <FontAwesomeIcon icon={faEye} /> View
                </Link>
                {userRole === 'Project Manager' && (
                  <>
                    <Button variant="warning" style={{ ...buttonStyle, backgroundColor: '#FFD700', color: '#fff' }} onClick={() => handleOpenEditModal(project)}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </Button>
                    <Button variant="danger" style={{ ...buttonStyle, backgroundColor: '#B22222', color: '#fff' }} onClick={() => handleDeleteProject(project)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                  </>
                )}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <NewProjectForm show={showModal} handleClose={handleClose} handleAddProject={handleAddProject} />
      {editProject && <EditProjectForm show={showEditModal} handleClose={handleClose} handleEditProject={handleEditProject} project={editProject} />}
      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this project?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Projects;
