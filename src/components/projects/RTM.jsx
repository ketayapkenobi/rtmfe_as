import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Col, Container, Row, Form, Button, Table, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLink } from '@fortawesome/free-solid-svg-icons'; // Add any other icons you need

const RTMPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedYaxis, setSelectedYaxis] = useState("");
    const [selectedXaxis, setSelectedXaxis] = useState("");
    const [requirements, setRequirements] = useState([]);
    const [testCases, setTestCases] = useState([]);
    const [testPlans, setTestPlans] = useState([]);
    const [testExecutions, setTestExecutions] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchRequirements(selectedProject);
            fetchTestCases(selectedProject);
            fetchTestPlans(selectedProject);
            fetchTestExecutions(selectedProject);
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
        fetch(`http://localhost:8000/api/projects/${projectId}/requirements`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch requirements");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Requirements data:", data.requirements);
                if (Array.isArray(data.requirements)) {
                    setRequirements(data.requirements);
                } else {
                    console.error("Invalid data format for requirements:", data);
                    setRequirements([]); // Set requirements to an empty array
                }
            })
            .catch((error) => {
                console.error("Error fetching requirements:", error);
                setRequirements([]); // Set requirements to an empty array
            });
    };

    const fetchTestCases = (projectId) => {
        fetch(`http://localhost:8000/api/projects/${projectId}/testcases`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch test cases");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Test cases data:", data.testcases);
                if (Array.isArray(data.testcases)) {
                    setTestCases(data.testcases);
                } else {
                    console.error("Invalid data format for test cases:", data);
                    setTestCases([]); // Set testCases to an empty array
                }
            })
            .catch((error) => {
                console.error("Error fetching test cases:", error);
                setTestCases([]); // Set testCases to an empty array
            });
    };

    const fetchTestPlans = (projectId) => {
        return fetch(`http://localhost:8000/api/projects/${projectId}/testplans`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch test plans");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Test plans data:", data.testPlans);
                if (Array.isArray(data.testPlans)) {
                    setTestPlans(data.testPlans);
                } else {
                    console.error("Invalid data format for test plans:", data);
                    setTestPlans([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching test plans:", error);
                setTestPlans([]);
            });
    };

    const fetchTestExecutions = (projectId) => {
        return fetch(`http://localhost:8000/api/projects/${projectId}/testexecutions`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch test executions");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Test executions data:", data.testExecutions);
                if (Array.isArray(data.testExecutions)) {
                    setTestExecutions(data.testExecutions);
                } else {
                    console.error("Invalid data format for test executions:", data);
                    setTestExecutions([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching test executions:", error);
                setTestExecutions([]);
            });
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
        if (!selectedYaxis || !selectedXaxis) {
            console.error("Row or column type not selected.");
            return [];
        }

        let rowData, columnData;

        switch (selectedYaxis) {
            case "requirements":
                rowData = requirements.map((req) => req.requirementID);
                break;
            case "testcases":
                rowData = testCases.map((testCase) => testCase.testcaseID);
                break;
            case "testplans":
                rowData = testPlans.map((testPlan) => testPlan.testplanID);
                break;
            case "testexecutions":
                rowData = testExecutions.map((testExecution) => testExecution.testexecutionID);
                break;
            default:
                console.error("Invalid selection for row data.");
                return;
        }

        switch (selectedXaxis) {
            case "requirements":
                columnData = requirements.map((req) => req.requirementID);
                break;
            case "testcases":
                columnData = testCases.map((testCase) => testCase.testcaseID);
                break;
            case "testplans":
                columnData = testPlans.map((testPlan) => testPlan.testplanID);
                break;
            case "testexecutions":
                columnData = testExecutions.map((testExecution) => testExecution.testexecutionID);
                break;
            default:
                console.error("Invalid selection for column data.");
                return;
        }

        const data = [
            ["", ...columnData], // Header row
            ...rowData.map((rowItem) => {
                return [
                    rowItem,
                    ...columnData.map((columnItem) => {
                        let relationship = "";
                        switch (selectedYaxis) {
                            case "requirements":
                                const req = requirements.find((r) => r.requirementID === rowItem);
                                if (req) {
                                    switch (selectedXaxis) {
                                        case "testcases":
                                            relationship = req.testCases.includes(columnItem) ? <FontAwesomeIcon icon={faLink} /> : "";
                                            break;
                                        case "testplans":
                                            // Implement logic for requirements and test plans relationship
                                            break;
                                        case "testexecutions":
                                            // Implement logic for requirements and test executions relationship
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            case "testcases":
                                const testCase = testCases.find((r) => r.testcaseID === rowItem);
                                if (testCase) {
                                    switch (selectedXaxis) {
                                        case "requirements":
                                            relationship = testCase.requirements.includes(columnItem) ? <FontAwesomeIcon icon={faLink} /> : "";
                                            break;
                                        case "testplans":
                                            // Implement logic for requirements and test plans relationship
                                            break;
                                        case "testexecutions":
                                            // Implement logic for requirements and test executions relationship
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            case "testplans":
                                const testPlan = testPlans.find((r) => r.testplanID === rowItem);
                                if (testPlan) {
                                    switch (selectedXaxis) {
                                        case "requirements":
                                            //
                                            break;
                                        case "testcases":
                                            //
                                            break;
                                        case "testexecutions":
                                            // Implement logic for requirements and test executions relationship
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            case "testexecutions":
                                const testExecution = testExecutions.find((r) => r.testexecutionID === rowItem);
                                if (testExecution) {
                                    switch (selectedXaxis) {
                                        case "requirements":
                                            //
                                            break;
                                        case "testcases":
                                            //
                                            break;
                                        case "testplans":
                                            // 
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            // Implement logic for other combinations of row and column types
                            default:
                                break;
                        }
                        return relationship;
                    })
                ];
            })
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
                                        <option value="testcases">Test Cases</option>
                                        <option value="testplans">Test Plans</option>
                                        <option value="testexecutions">Test Executions</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="XaxisSelect">
                                    <Form.Label>Select Type for Row:</Form.Label>
                                    <Form.Control as="select" onChange={handleXaxisChange} value={selectedXaxis}>
                                        <option value="">Select type for row...</option>
                                        <option value="requirements">Requirements</option>
                                        <option value="testcases">Test Cases</option>
                                        <option value="testplans">Test Plans</option>
                                        <option value="testexecutions">Test Executions</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" className="mt-3" onClick={handleGenerateReport}>
                            {"Generate Report"}
                        </Button>
                    </Form>
                </Col>
                {tableData.length > 0 && (
                    <Card className="mt-3">
                        <Card.Body>
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
                                                    <td key={cellIndex} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                )}
            </Row>
        </Container>
    );
};

export default RTMPage;
