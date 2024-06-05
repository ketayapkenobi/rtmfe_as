import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge, Card, Dropdown, Table } from "react-bootstrap";
import { MoreHorizontal } from "react-feather";

import { API_URL } from "../../../Api";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects
    axios.get(`${API_URL}/projects`)
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  return (
    <Card className="flex-fill w-100">
      <Card.Header>
        <div className="card-actions float-end">
          {/* <Dropdown align="end">
            <Dropdown.Toggle as="a" bsPrefix="-">
              <MoreHorizontal />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Action</Dropdown.Item>
              <Dropdown.Item>Another Action</Dropdown.Item>
              <Dropdown.Item>Something else here</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
        </div>
        <Card.Title className="mb-0">List of Projects</Card.Title>
      </Card.Header>
      <Table striped className="my-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.projectID}</td>
              <td>{project.projectName}</td>
              <td>{project.projectDesc}</td>
              <td>
                {project.projectDesc === 'Done' && <Badge bg="success">{project.projectDesc}</Badge>}
                {project.projectDesc === 'Cancelled' && <Badge bg="danger">{project.projectDesc}</Badge>}
                {project.projectDesc === 'In progress' && <Badge bg="warning">{project.projectDesc}</Badge>}
              </td>
              <td>{project.assignee}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default Projects;
