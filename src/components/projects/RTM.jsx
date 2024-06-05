import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Col, Container, Row, Form, Button, Table, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLink } from '@fortawesome/free-solid-svg-icons'; // Add any other icons you need
import html2pdf from "html2pdf.js";

import { API_URL } from "../../Api";

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
    const [isTableGenerated, setIsTableGenerated] = useState(false);
    const cardRef = useRef(null);

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
        fetch(`${API_URL}/projects`)
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => console.error("Error fetching projects:", error));
    };

    const fetchRequirements = (projectId) => {
        fetch(`${API_URL}/projects/${projectId}/requirements`)
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
        fetch(`${API_URL}/projects/${projectId}/testcases`)
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
        return fetch(`${API_URL}/projects/${projectId}/testplans`)
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
        return fetch(`${API_URL}/projects/${projectId}/testexecutions`)
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
                rowData = requirements.map((req) => `${req.requirementID} - ${req.name}`);
                break;
            case "testcases":
                rowData = testCases.map((testCase) => `${testCase.testcaseID} - ${testCase.name}`);
                break;
            case "testplans":
                rowData = testPlans.map((testPlan) => `${testPlan.testplanID} - ${testPlan.name}`);
                break;
            case "testexecutions":
                rowData = testExecutions.map((testExecution) => `${testExecution.testexecutionID} - ${testExecution.name}`);
                break;
            default:
                console.error("Invalid selection for row data.");
                return;
        }

        switch (selectedXaxis) {
            case "requirements":
                columnData = requirements.map((req) => `${req.requirementID} - ${req.name}`);
                break;
            case "testcases":
                columnData = testCases.map((testCase) => `${testCase.testcaseID} - ${testCase.name}`);
                break;
            case "testplans":
                columnData = testPlans.map((testPlan) => `${testPlan.testplanID} - ${testPlan.name}`);
                break;
            case "testexecutions":
                columnData = testExecutions.map((testExecution) => `${testExecution.testexecutionID} - ${testExecution.name}`);
                break;
            default:
                console.error("Invalid selection for column data.");
                return;
        }

        const data = [
            ["", ...columnData, "Total"], // Header row
            ...rowData.map((rowItem, rowIndex) => {
                const [rowId, rowName] = rowItem.split(' - '); // Split the rowItem by ' - '
                let total = 0;
                const row = [
                    `${rowId} - ${rowName}`, // Include both ID and name
                    ...columnData.map((columnItem, columnIndex) => {
                        const [columnId, columnName] = columnItem.split(' - '); // Split the columnItem by ' - '
                        let relationship = "";
                        switch (selectedYaxis) {
                            case "requirements":
                                const req = requirements.find((r) => r.requirementID === rowId);
                                if (req) {
                                    switch (selectedXaxis) {
                                        case "testcases":
                                            relationship = req.testCases.includes(columnId)
                                                ? 'X'
                                                : "";
                                            break;
                                        case "testplans":
                                            relationship = req.testPlans.includes(columnId)
                                                ? 'X'
                                                : "";
                                            break;
                                        // case "testexecutions":
                                        //     relationship = req.testExecutions.includes(columnId)
                                        //         ? 'X'
                                        //         : "";
                                        //     break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            case "testcases":
                                const testCase = testCases.find((r) => r.testcaseID === rowId);
                                if (testCase) {
                                    switch (selectedXaxis) {
                                        case "requirements":
                                            relationship = testCase.requirements.includes(columnId)
                                                ? 'X'
                                                : "";
                                            break;
                                        case "testplans":
                                            relationship = testCase.testplans.includes(columnId)
                                                ? 'X'
                                                : "";
                                            break;
                                        // case "testexecutions":
                                        //     relationship = testCase.testExecutions.includes(columnId)
                                        //         ? 'X'
                                        //         : "";
                                        //     break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            case "testplans":
                                const testPlan = testPlans.find((r) => r.testplanID === rowId);
                                if (testPlan) {
                                    switch (selectedXaxis) {
                                        case "requirements":
                                            relationship = testPlan.requirements.includes(columnId)
                                                ? 'X'
                                                : "";
                                            break;
                                        case "testcases":
                                            relationship = testPlan.testcases.includes(columnId)
                                                ? 'X'
                                                : "";
                                            break;
                                        // case "testexecutions":
                                        //     // Implement logic for test plans and test executions relationship
                                        //     break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            // case "testexecutions":
                            //     const testExecution = testExecutions.find((r) => r.testexecutionID === rowId);
                            //     if (testExecution) {
                            //         switch (selectedXaxis) {
                            //             case "requirements":
                            //                 //
                            //                 break;
                            //             case "testcases":
                            //                 //
                            //                 break;
                            //             case "testplans":
                            //                 // Implement logic for test executions and test plans relationship
                            //                 break;
                            //             default:
                            //                 break;
                            //         }
                            //     }
                            //     break;
                            // Implement logic for other row types as needed
                            default:
                                break;
                        }
                        total += relationship ? 1 : 0;
                        return relationship;
                    }),
                    total,
                ];
                return row;
            }),
        ];

        // Calculate and add totals for each column
        const columnTotals = Array(columnData.length).fill(0);
        data.slice(1).forEach((row) => {
            row.slice(1, -1).forEach((relationship, index) => {
                if (relationship) {
                    columnTotals[index]++;
                }
            });
        });

        data.push(["Total", ...columnTotals, ""]); // Add totals row

        setIsTableGenerated(true);
        setTableData(data);
    };

    const exportToPDF = () => {
        const cardElement = cardRef.current;
        if (cardElement) {
            const opt = {
                margin: 1,
                filename: "RTM_Report.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
            };

            html2pdf().from(cardElement).set(opt).save();
        }
    };

    const exportToCSV = () => {
        const rows = tableData.map(row => row.join(','));
        const csv = rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'RTM_Report.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Container>
            <Helmet>
                <title>Requirement Traceability Matrix</title>
            </Helmet>
            <h1>Requirement Traceability Matrix</h1>
            <Row>
                <Col md={6}>
                    <Form.Group controlId="projectSelect">
                        <Form.Label>Project</Form.Label>
                        <Form.Control as="select" value={selectedProject} onChange={handleProjectChange}>
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project.projectID} value={project.projectID}>
                                    {project.projectName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="yAxisSelect">
                        <Form.Label>Row</Form.Label>
                        <Form.Control as="select" value={selectedYaxis} onChange={handleYaxisChange}>
                            <option value="">Select row type</option>
                            <option value="requirements">Requirements</option>
                            <option value="testcases">Test Cases</option>
                            <option value="testplans">Test Plans</option>
                            {/* <option value="testexecutions">Test Executions</option> */}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="xAxisSelect">
                        <Form.Label>Column</Form.Label>
                        <Form.Control as="select" value={selectedXaxis} onChange={handleXaxisChange}>
                            <option value="">Select column type</option>
                            <option value="requirements">Requirements</option>
                            <option value="testcases">Test Cases</option>
                            <option value="testplans">Test Plans</option>
                            {/* <option value="testexecutions">Test Executions</option> */}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button className="mt-3" onClick={handleGenerateReport}>
                        Generate Report
                    </Button>
                    {isTableGenerated && (
                        <>
                            <Button className="mt-3 ml-2" onClick={exportToPDF} style={{ marginLeft: '8px' }}>
                                Export to PDF
                            </Button>
                            <Button className="mt-3 ml-2" onClick={exportToCSV} style={{ marginLeft: '8px' }}>
                                Export to CSV
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
            {isTableGenerated && (
                <Card ref={cardRef} className="mt-3">
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {tableData[0]?.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.slice(1).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                <strong>{cell}</strong>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default RTMPage;
