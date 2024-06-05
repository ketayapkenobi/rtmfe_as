import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import usePalette from "../../hooks/usePalette";
import TestExecutionPieChart from "./TestExecutionPieChart";
import TestPlanBarChart from "./TestPlanBarChart";

import { API_URL } from "../../Api";

const TE_GenerateReport = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedTestExecution, setSelectedTestExecution] = useState("");
    const [testExecutions, setTestExecutions] = useState([]);
    const [selectedTestPlan, setSelectedTestPlan] = useState("");
    const [testPlans, setTestPlans] = useState([]);
    const [reportComponent, setReportComponent] = useState(null);
    const [testExecutionsProgress, setTestExecutionsProgress] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progressData, setProgressData] = useState(null);
    const [showChart, setShowChart] = useState(false);
    const palette = usePalette();

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

    const fetchTestExecutions = (projectID) => {
        fetch(`${API_URL}/testexecutions/${projectID}`)
            .then((response) => response.json())
            .then((data) => {
                setTestExecutions(data.testExecutions);
            })
            .catch((error) => console.error("Error fetching test executions:", error));
    };

    const fetchTestPlans = (projectID) => {
        fetch(`${API_URL}/testplans/${projectID}/index`)
            .then((response) => response.json())
            .then((data) => {
                setTestPlans(data.testPlans);
            })
            .catch((error) => console.error("Error fetching test plans:", error));
    };

    const handleProjectChange = (event) => {
        const projectID = event.target.value;
        setSelectedProject(projectID);
        fetchTestExecutions(projectID);
        fetchTestPlans(projectID);
    };

    const handleTestExecutionChange = (event) => {
        setSelectedTestExecution(event.target.value);
        setSelectedTestPlan("");
    };

    const handleTestPlanChange = (event) => {
        setSelectedTestPlan(event.target.value);
        setSelectedTestExecution("");
    };

    const fetchProgress = (testexecutionID) => {
        fetch(`${API_URL}/testexecutions/${testexecutionID}/progress`)
            .then((response) => response.json())
            .then((data) => {
                const progressData = data.progress.reduce((acc, item) => {
                    acc[item.result_id] = item.percentage;
                    return acc;
                }, {});
                setProgressData(progressData);
                setShowChart(true);
            })
            .catch((error) => console.error("Error fetching progress:", error));
    };

    const colors = [
        palette.primary,
        palette.warning,
        palette.danger,
        "#E8EAED", // Default color for 'Other' if there are more than 3 items
    ];

    const mapResultName = (id) => {
        switch (id) {
            case '1':
                return 'To Do';
            case '2':
                return 'In Progress';
            case '3':
                return 'Pass';
            case '4':
                return 'Fail';
            case '5':
                return 'Blocked';
            case '6':
                return 'Passed with Restriction';
            default:
                return '';
        }
    };

    const legendLabels = progressData ? Object.keys(progressData).map((id) => mapResultName(id)) : [];

    const getBackgroundColor = (label) => {
        switch (label) {
            case 'To Do':
                return '#808080';
            case 'In Progress':
                return '#3498db';
            case 'Pass':
                return '#27ae60';
            case 'Fail':
                return '#e74c3c';
            case 'Blocked':
                return '#9b59b6';
            case 'Passed with Restriction':
                return '#f39c12';
            default:
                return "#E8EAED"; // Default color for 'Other' if there are more than 6 items
        }
    };

    const fetchTestExecutionsForTestPlan = (testplanID) => {
        fetch(`${API_URL}/testplans/${testplanID}/testexecutions`)
            .then((response) => response.json())
            .then((data) => {
                setTestExecutionsProgress(data.testExecutionsProgress); // Set the state with the fetched data
            })
            .catch((error) => console.error("Error fetching test executions for test plan:", error));
    };

    const handleGenerateReport = () => {
        if (selectedProject && selectedTestExecution) {
            setLoading(true);
            fetchProgress(selectedTestExecution);
            setLoading(false);
            setReportComponent(null);
            setTestExecutionsProgress([]); // Clear test plan progress data
        } else if (selectedProject && selectedTestPlan) {
            fetchTestExecutionsForTestPlan(selectedTestPlan);
            setProgressData(null); // Clear test execution progress data
            setShowChart(false);
        } else {
            alert("Please select a project and either a test execution or a test plan.");
        }
    };

    return (
        <Container fluid className="p-0">
            <Helmet title="Test Executions" />
            <h1 className="h3 mb-3">Test Executions</h1>
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
                                <Form.Group controlId="testExecutionSelect">
                                    <Form.Label>Select Test Execution:</Form.Label>
                                    <Form.Control as="select" onChange={handleTestExecutionChange} value={selectedTestExecution}>
                                        <option value="">Select a test execution...</option>
                                        {testExecutions.map((testExecution) => (
                                            <option key={testExecution.id} value={testExecution.testexecutionID}>
                                                {testExecution.testexecutionID}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="testPlanSelect">
                                    <Form.Label>Select Test Plan:</Form.Label>
                                    <Form.Control as="select" onChange={handleTestPlanChange} value={selectedTestPlan}>
                                        <option value="">Select a test plan...</option>
                                        {testPlans.map((testPlan) => (
                                            <option key={testPlan.id} value={testPlan.testplanID}>
                                                {testPlan.testplanID}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" onClick={handleGenerateReport} className="mt-3" disabled={loading}>
                            {loading ? "Generating..." : "Generate Report"}
                        </Button>
                    </Form>
                </Col>
                {progressData && showChart && (
                    <TestExecutionPieChart
                        progressData={progressData}
                        legendLabels={legendLabels}
                        getBackgroundColor={getBackgroundColor}
                        palette={palette}
                        projectID={selectedProject}
                        selectedTestExecution={selectedTestExecution}
                    />
                )}
                {testExecutionsProgress && testExecutionsProgress.length > 0 && (
                    <TestPlanBarChart
                        selectedProject={selectedProject}
                        selectedTestPlan={selectedTestPlan}
                        testExecutionsProgress={testExecutionsProgress}
                    />
                )}
            </Row>
        </Container>
    );
};

export default TE_GenerateReport;
