import React, { useState } from 'react';

function ProjectNavbar({ handleMenuItemClick }) {
    const [activeItem, setActiveItem] = useState('Requirements');

    const handleItemClick = (item) => {
        setActiveItem(item);
        handleMenuItemClick(item);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button className={`nav-link btn btn-link text-dark ${activeItem === 'Requirements' ? 'active' : ''}`} style={{ boxShadow: activeItem === 'Requirements' ? '0px 2px 0px 0px #007bff' : '', backgroundColor: activeItem === 'Requirements' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)', marginRight: '10px', padding: '10px 20px', borderRadius: '5px' }} onClick={() => handleItemClick('Requirements')}>Requirements</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link btn btn-link text-dark ${activeItem === 'Test Cases' ? 'active' : ''}`} style={{ boxShadow: activeItem === 'Test Cases' ? '0px 2px 0px 0px #007bff' : '', backgroundColor: activeItem === 'Test Cases' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)', marginRight: '10px', padding: '10px 20px', borderRadius: '5px' }} onClick={() => handleItemClick('Test Cases')}>Test Cases</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link btn btn-link text-dark ${activeItem === 'Test Plans' ? 'active' : ''}`} style={{ boxShadow: activeItem === 'Test Plans' ? '0px 2px 0px 0px #007bff' : '', backgroundColor: activeItem === 'Test Plans' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)', marginRight: '10px', padding: '10px 20px', borderRadius: '5px' }} onClick={() => handleItemClick('Test Plans')}>Test Plans</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link btn btn-link text-dark ${activeItem === 'Test Executions' ? 'active' : ''}`} style={{ boxShadow: activeItem === 'Test Executions' ? '0px 2px 0px 0px #007bff' : '', backgroundColor: activeItem === 'Test Executions' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)', padding: '10px 20px', borderRadius: '5px' }} onClick={() => handleItemClick('Test Executions')}>Test Executions</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default ProjectNavbar;
