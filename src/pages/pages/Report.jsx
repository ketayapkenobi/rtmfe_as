// Report.js
import React, { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import GeneralReport from "../../components/projects/GeneralReport";
import CoverageReport from "../../components/projects/CoverageReport";
import RTMPage from "../../components/projects/RTM";

const Report = () => {
    const [activeTab, setActiveTab] = useState("General Report");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Container fluid>
            <Nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button className={`nav-link btn btn-link text-dark ${activeTab === 'General Report' ? 'active' : ''}`} style={{ boxShadow: activeTab === 'General Report' ? '0px 2px 0px 0px #007bff' : '', backgroundColor: activeTab === 'General Report' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)', marginRight: '10px', padding: '10px 20px', borderRadius: '5px' }} onClick={() => handleTabChange('General Report')}>General Report</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link btn btn-link text-dark ${activeTab === 'Requirement Traceability Matrix' ? 'active' : ''}`} style={{ boxShadow: activeTab === 'Requirement Traceability Matrix' ? '0px 2px 0px 0px #007bff' : '', backgroundColor: activeTab === 'Requirement Traceability Matrix' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)', marginRight: '10px', padding: '10px 20px', borderRadius: '5px' }} onClick={() => handleTabChange('Requirement Traceability Matrix')}>Requirement Traceability Matrix</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link btn btn-link text-dark ${activeTab === 'Coverage' ? 'active' : ''}`} style={{ boxShadow: activeTab === 'Coverage' ? '0px 2px 0px 0px #007bff' : '', backgroundColor: activeTab === 'Coverage' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)', marginRight: '10px', padding: '10px 20px', borderRadius: '5px' }} onClick={() => handleTabChange('Coverage')}>Test Executions</button>
                    </li>
                </ul>
            </Nav>

            <Container className="mt-4">
                {activeTab === "General Report" && <GeneralReport />}
                {activeTab === "Requirement Traceability Matrix" && <RTMPage />}
                {activeTab === "Coverage" && <CoverageReport />}
            </Container>
        </Container>
    );
};

export default Report;
