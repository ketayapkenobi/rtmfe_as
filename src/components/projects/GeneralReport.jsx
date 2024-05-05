import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import RequirementsReport from "./RequirementsReport";
import TestCasesReport from "./TestCasesReport";
import TestPlansReport from "./TestPlansReport";
import TestExecutionsReport from "./TestExecutionsReport";

const GeneralReport = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedReportType, setSelectedReportType] = useState("");
    const [generatedReport, setGeneratedReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        fetch("http://localhost:8000/api/projects")
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => console.error("Error fetching projects:", error));
    };

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const handleReportTypeChange = (event) => {
        setSelectedReportType(event.target.value);
    };

    const handleGenerateReport = () => {
        if (selectedProject && selectedReportType) {
            setLoading(true);
            const endpoint = `http://localhost:8000/api/projects/${selectedProject}/${selectedReportType}/report`;
            fetch(endpoint)
                .then((response) => response.json())
                .then((data) => {
                    setGeneratedReport(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error generating report:", error);
                    setLoading(false);
                });
        } else {
            alert("Please select a project and report type.");
        }
    };

    return (
        <Container fluid className="p-0">
            <Helmet title="General Report" />
            <h1 className="h3 mb-3">General Report</h1>
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
                            <Col>
                                <Form.Group controlId="reportTypeSelect">
                                    <Form.Label>Select Report Type:</Form.Label>
                                    <Form.Control as="select" onChange={handleReportTypeChange} value={selectedReportType}>
                                        <option value="">Select a report type...</option>
                                        <option value="requirements">Requirements</option>
                                        <option value="testcases">Test Cases</option>
                                        <option value="testplans">Test Plans</option>
                                        <option value="testexecutions">Test Executions</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" onClick={handleGenerateReport} className="mt-3" disabled={loading}>
                            {loading ? "Generating..." : "Generate Report"}
                        </Button>
                    </Form>
                </Col>
            </Row>
            {generatedReport && (
                <Container className="mt-4">
                    {selectedReportType === "requirements" && (
                        <RequirementsReport generatedReport={generatedReport} />
                    )}
                    {selectedReportType === "testcases" && (
                        <TestCasesReport generatedReport={generatedReport} />
                    )}
                    {selectedReportType === "testplans" && (
                        <TestPlansReport generatedReport={generatedReport} />
                    )}
                    {selectedReportType === "testexecutions" && (
                        <TestExecutionsReport generatedReport={generatedReport} />
                    )}
                </Container>
            )}
        </Container>
    );
};

export default GeneralReport;
