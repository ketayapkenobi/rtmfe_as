import React, { useState, useEffect } from 'react';

function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/projects')
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
