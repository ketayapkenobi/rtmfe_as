import React from 'react';
import { NavLink } from 'react-router-dom';

function ProjectNavbar({ handleMenuItemClick }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button className="nav-link btn btn-link text-dark" style={{ backgroundColor: 'lightblue', marginRight: '10px', padding: '10px 20px' }} onClick={() => handleMenuItemClick('Requirements')}>Requirements</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link btn btn-link text-dark" style={{ backgroundColor: 'lightgreen', marginRight: '10px', padding: '10px 20px' }} onClick={() => handleMenuItemClick('Test Cases')}>Test Cases</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link btn btn-link text-dark" style={{ backgroundColor: 'lightcoral', marginRight: '10px', padding: '10px 20px' }} onClick={() => handleMenuItemClick('Test Plans')}>Test Plans</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link btn btn-link text-dark" style={{ backgroundColor: 'lightgoldenrodyellow', padding: '10px 20px' }} onClick={() => handleMenuItemClick('Test Executions')}>Test Executions</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}





export default ProjectNavbar;
