import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectNavbar from './ProjectNavbar';
import RequirementSpreadsheet from './RequirementSpreadsheet';
import TestCaseSpreadsheet from './TestCaseSpreadsheet';
import TestPlan from './TestPlan';
import TestExecution from './TestExecution';
import { Card, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { PulseLoader } from 'react-spinners'; // Import the PulseLoader component

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [showTeamMembers, setShowTeamMembers] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8000/api/projects/${id}`)
            .then(response => response.json())
            .then(data => setProject(data))
            .catch(error => console.error('Error:', error));

        fetch(`http://localhost:8000/api/projects/${id}/members`)
            .then(response => response.json())
            .then(data => setTeamMembers(data.members))
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!project) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <PulseLoader color="#007bff" size={15} margin={5} />
            </div>
        );
    }

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    let content = null;
    switch (selectedMenuItem) {
        case 'Requirements':
            content = <RequirementSpreadsheet projectID={project.projectID} />;
            break;
        case 'Test Cases':
            content = <TestCaseSpreadsheet projectID={project.projectID} />;
            break;
        case 'Test Plans':
            content = <TestPlan projectID={project.projectID} />; break;
        case 'Test Executions':
            content = <TestExecution projectID={project.projectID} />;
            break;
        default:
            content = null;
    }

    return (
        <div>
            <h2>{project.projectName} ({project.projectID})</h2>
            <p>{project.projectDesc}</p>
            <Card>
                <Card.Header as="h5" onClick={() => setShowTeamMembers(!showTeamMembers)} style={{ cursor: 'pointer' }}>
                    Team Members <FontAwesomeIcon icon={faChevronDown} />
                </Card.Header>
                {showTeamMembers && (
                    <ListGroup variant="flush" style={{ marginTop: '10px' }}>
                        {teamMembers.map(member => (
                            <ListGroup.Item key={member.id}>{member.name}</ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card>
            <ProjectNavbar handleMenuItemClick={handleMenuItemClick} />
            {content}
        </div>
    );
}

export default ProjectDetails;
