import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectNavbar from './ProjectNavbar';
import RequirementSpreadsheet from './RequirementSpreadsheet';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/api/projects/${id}`)
            .then(response => response.json())
            .then(data => setProject(data))
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!project) {
        return <div>Loading...</div>;
    }

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    let content = null;
    switch (selectedMenuItem) {
        case 'Requirements':
            content = <RequirementSpreadsheet requirement={project.requirement} />;
            break;
        case 'Test Cases':
            content = <p>This is the test cases of the project</p>;
            break;
        case 'Test Plans':
            content = <p>This is the test plans of the project</p>;
            break;
        case 'Test Executions':
            content = <p>This is the test executions of the project</p>;
            break;
        default:
            content = null;
    }

    return (
        <div>
            <h2>{project.projectName} ({project.projectID})</h2>
            <p>{project.projectDesc}</p>
            <ProjectNavbar handleMenuItemClick={handleMenuItemClick} />
            {content}
        </div>
    );
}

export default ProjectDetails;
