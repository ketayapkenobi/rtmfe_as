// Projects.jsx
import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Col, Container, ListGroup, Modal, ProgressBar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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
        } else {
          console.error('Failed to fetch current user');
        }

        // Fetch projects
        const projectsResponse = await fetch('http://localhost:8000/api/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
        } else {
          console.error('Failed to fetch projects');
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

  return (
    <Container fluid className="p-0">
      <Button variant="primary" className="float-end mt-n1" onClick={handleShow} style={{ display: userRole === 'Project Manager' ? 'block' : 'none' }}>
        <FontAwesomeIcon icon={faPlus} /> New project
      </Button>
      <h1 className="h3 mb-3">Projects</h1>

      <Row>
        {projects.map(project => (
          <Col key={project.id} md="6" lg="4" xl="3" className="mb-4">
            <Card>
              {project.image && <Card.Img src={project.image} alt="Card image cap" />}
              <Card.Header className="px-4 pt-4">
                <Card.Title className="mb-0">{project.projectName}</Card.Title>
                <Badge className="my-2" bg="primary">
                  {project.state}
                </Badge>
              </Card.Header>
              <Card.Body className="px-4 pt-2">
                <p>{project.projectDesc}</p>
              </Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-4 pb-4">
                  <p className="mb-2 fw-bold">
                    {/* Progress<span className="float-end">{project.percentage}%</span> */}
                  </p>
                  {/* <ProgressBar className="progress-sm" now={project.percentage} /> */}
                </ListGroup.Item>
              </ListGroup>
              <Card.Footer className="text-center">
                <Link to={`/pages/project/${project.id}`} className="btn btn-primary me-2">View</Link>
                <Button variant="warning" className="me-2" onClick={() => handleOpenEditModal(project)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteProject(project)}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
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
