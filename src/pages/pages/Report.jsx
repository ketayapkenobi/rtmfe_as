// Report.js
import React, { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GeneralReport from "../../components/projects/GeneralReport";
import TE_GenerateReport from "../../components/projects/TE_GenerateReport";
import RTMPage from "../../components/projects/RTM";
import CoverageReport from "../../components/projects/CoverageReport";
import { API_URL } from "../../Api";

const isUserLoggedIn = () => {
    return !!localStorage.getItem('token');
};

const Report = () => {
    const [activeTab, setActiveTab] = useState("General Report");
    const [userID, setUserID] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate('/auth/sign-in');
        } else {
            const fetchData = async () => {
                const authToken = localStorage.getItem("token");
                try {
                    const userResponse = await fetch(`${API_URL}/current-user`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUserID(userData.userID);
                    } else {
                        console.error("Failed to fetch current user");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [navigate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (userID === null) {
        return <div>Loading...</div>; // Or a loading spinner, etc.
    }

    return (
        <Container fluid>
            <Nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button
                            className={`nav-link btn btn-link text-dark ${activeTab === 'General Report' ? 'active' : ''}`}
                            style={{
                                boxShadow: activeTab === 'General Report' ? '0px 2px 0px 0px #007bff' : '',
                                backgroundColor: activeTab === 'General Report' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)',
                                marginRight: '10px', padding: '10px 20px', borderRadius: '5px'
                            }}
                            onClick={() => handleTabChange('General Report')}
                        >
                            General Report
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link btn btn-link text-dark ${activeTab === 'Requirement Traceability Matrix' ? 'active' : ''}`}
                            style={{
                                boxShadow: activeTab === 'Requirement Traceability Matrix' ? '0px 2px 0px 0px #007bff' : '',
                                backgroundColor: activeTab === 'Requirement Traceability Matrix' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)',
                                marginRight: '10px', padding: '10px 20px', borderRadius: '5px'
                            }}
                            onClick={() => handleTabChange('Requirement Traceability Matrix')}
                        >
                            Requirement Traceability Matrix
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link btn btn-link text-dark ${activeTab === 'Test Executions' ? 'active' : ''}`}
                            style={{
                                boxShadow: activeTab === 'Test Executions' ? '0px 2px 0px 0px #007bff' : '',
                                backgroundColor: activeTab === 'Test Executions' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)',
                                marginRight: '10px', padding: '10px 20px', borderRadius: '5px'
                            }}
                            onClick={() => handleTabChange('Test Executions')}
                        >
                            Test Executions
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link btn btn-link text-dark ${activeTab === 'Coverage Report' ? 'active' : ''}`}
                            style={{
                                boxShadow: activeTab === 'Coverage Report' ? '0px 2px 0px 0px #007bff' : '',
                                backgroundColor: activeTab === 'Coverage Report' ? 'lightblue' : 'rgba(173, 216, 230, 0.5)',
                                marginRight: '10px', padding: '10px 20px', borderRadius: '5px'
                            }}
                            onClick={() => handleTabChange('Coverage Report')}
                        >
                            Coverage Report
                        </button>
                    </li>
                </ul>
            </Nav>

            <Container className="mt-4">
                {activeTab === "General Report" && <GeneralReport userID={userID} />}
                {activeTab === "Requirement Traceability Matrix" && <RTMPage userID={userID} />}
                {activeTab === "Test Executions" && <TE_GenerateReport userID={userID} />}
                {activeTab === "Coverage Report" && <CoverageReport userID={userID} />}
            </Container>
        </Container>
    );
};

export default Report;
