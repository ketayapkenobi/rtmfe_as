import React, { useState, useEffect } from 'react';

import { API_URL } from "../../Api";

function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/projects`)
            .then(response => response.json())
            .then(data => setProjects(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>{project.projectName}: {project.projectDesc}</li>
                ))}
            </ul>
        </div>
    );
}

export default Projects;
