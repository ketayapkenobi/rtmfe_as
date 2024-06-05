import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import RequirementsCoverageReport from "./RequirementsCoverageReport";
import TestCasesCoverageReport from "./TestCasesCoverageReport";
import TestPlansCoverageReport from "./TestPlansCoverageReport";
import TestExecutionsReport from "./TestExecutionsReport";

import { API_URL } from "../../Api";

const CoverageReport = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedReportType, setSelectedReportType] = useState("");
    const [generatedReport, setGeneratedReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        fetch(`${API_URL}/projects`)
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
        setGeneratedReport(null); // Reset generated report when report type changes
    };

    const handleGenerateReport = () => {
        setLoading(true);
        fetch(`${API_URL}/coverage/${selectedProject}/${selectedReportType}`)
            .then((response) => response.json())
            .then((data) => {
                setGeneratedReport(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error generating report:", error);
                setLoading(false);
            });
    };

    return (
        <Container fluid className="p-0">
            <Helmet title="General Report" />
            <h1 className="h3 mb-3">Coverage Report</h1>
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
            {selectedReportType && generatedReport && (
                <Container className="mt-4">
                    {selectedReportType === "requirements" && (
                        <RequirementsCoverageReport generatedReport={generatedReport} />
                    )}
                    {selectedReportType === "testcases" && (
                        <TestCasesCoverageReport generatedReport={generatedReport} />
                    )}
                    {selectedReportType === "testplans" && (
                        <TestPlansCoverageReport generatedReport={generatedReport} />
                    )}
                </Container>
            )}
        </Container>
    );
};

export default CoverageReport;

