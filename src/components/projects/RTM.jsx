import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Col, Container, Row, Form, Button, Table } from "react-bootstrap";

const RTMPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedYaxis, setSelectedYaxis] = useState("");
    const [selectedXaxis, setSelectedXaxis] = useState("");
    const [requirements, setRequirements] = useState([]);
    const [testCases, setTestCases] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchRequirements(selectedProject);
            fetchTestCases(selectedProject);
        }
    }, [selectedProject]);

    const fetchProjects = () => {
        fetch("http://localhost:8000/api/projects")
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => console.error("Error fetching projects:", error));
    };

    const fetchRequirements = (projectId) => {
        fetch(`http://localhost:8000/api/projects/${projectId}/requirementIDs`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Requirements data:", data);
                setRequirements(data);
            })
            .catch((error) => console.error("Error fetching requirements:", error));
    };

    const fetchTestCases = (projectId) => {
        fetch(`http://localhost:8000/api/projects/${projectId}/testcaseIDs`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Test cases data:", data);
                setTestCases(data);
            })
            .catch((error) => console.error("Error fetching test cases:", error));
    };

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const handleYaxisChange = (event) => {
        setSelectedYaxis(event.target.value);
    };

    const handleXaxisChange = (event) => {
        setSelectedXaxis(event.target.value);
    };

    const handleGenerateReport = () => {
        if (!Array.isArray(requirements.requirementID) || !Array.isArray(testCases.testcaseIDs)) {
            console.error("Test cases or requirements are not available or are not arrays.");
            return;
        }

        const data = [
            ["", ...testCases.testcaseIDs], // Use testcaseIDs here
            ...requirements.requirementID.map((requirementID) => [
                requirementID,
                ...testCases.testcaseIDs.map(() => "") // Use testcaseIDs here
            ])
        ];
        setTableData(data);
    };

    return (
        <Container fluid className="p-0">
            <Helmet title="Requirement Traceability Matrix" />
            <h1 className="h3 mb-3">Requirement Traceability Matrix</h1>
            <Row>
                <Col md="10" xl="8" className="mx-auto">
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="projectSelect">
                                    <Form.Label>Select Project:</Form.Label>
                                    <Form.Control as="select" onChange={handleProjectChange} value={selectedProject}>
                                        <option value="">Select a project...</option>
                                        {projects.map((project) => (
                                            <option key={project.id} value={project.projectID}>
                                                {project.projectID}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="YaxisSelect">
                                    <Form.Label>Select Type for Column:</Form.Label>
                                    <Form.Control as="select" onChange={handleYaxisChange} value={selectedYaxis}>
                                        <option value="">Select type for column...</option>
                                        <option value="requirements">Requirements</option>
                                        {/* Add other options as needed */}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="XaxisSelect">
                                    <Form.Label>Select Type for Row:</Form.Label>
                                    <Form.Control as="select" onChange={handleXaxisChange} value={selectedXaxis}>
                                        <option value="">Select type for row...</option>
                                        <option value="testcases">Test Cases</option>
                                        {/* Add other options as needed */}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" className="mt-3" onClick={handleGenerateReport}>
                            {"Generate Report"}
                        </Button>
                    </Form>
                    {tableData.length > 0 && (
                        <Table striped bordered hover className="mt-4">
                            <thead>
                                <tr>
                                    {tableData[0].map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.slice(1).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default RTMPage;
