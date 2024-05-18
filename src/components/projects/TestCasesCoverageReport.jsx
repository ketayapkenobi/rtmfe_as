import React, { useRef, useState, useEffect } from "react";
import { Card, Row, Col, Table, Button } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import html2pdf from "html2pdf.js";

const TestCasesCoverageReport = ({ generatedReport }) => {
    const cardRef = useRef(null);
    const pieChartRef = useRef(null);
    const [isChartReady, setIsChartReady] = useState(false);

    const { project_id, total_testcases, covered_testcases, coverage_percentage, notcovered_percentage, coverage, project_members } = generatedReport;

    const legendLabels = ["Covered", "Not Covered"];
    const progressData = [covered_testcases, total_testcases - covered_testcases];

    const getBackgroundColor = (legendLabel) => {
        return legendLabel === "Covered" ? "#ADD8E6" : "#FFC0CB";
    };

    const data = {
        labels: legendLabels,
        datasets: [
            {
                data: progressData,
                backgroundColor: legendLabels.map(getBackgroundColor),
                borderWidth: 1,
                borderColor: "#FFFFFF",
            },
        ],
    };

    const coveredTestcasesList = coverage
        .filter((item) => item.testplan_count > 0)
        .map((item) => ({
            testcase_id: item.testcase_id,
            testplans: item.testplans.join(", "),
        }));

    const notCoveredTestcasesList = coverage
        .filter((item) => item.testplan_count === 0)
        .map((item) => ({
            testcase_id: item.testcase_id,
        }));

    useEffect(() => {
        setIsChartReady(true);
    }, []);

    const handleExportPDF = async () => {
        if (!generatedReport || !isChartReady) return;

        const exportContent = document.createElement("div");

        // Add Styles
        const styles = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                h1, h2, h3, h4, h5 {
                    color: #333;
                    margin: 0 0 10px;
                    padding: 0;
                }
                .title-page {
                    text-align: center;
                    margin-top: 50px;
                }
                .section {
                    margin: 20px 0;
                }
                .section h5 {
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 5px;
                    margin-bottom: 10px;
                }
                .table-container {
                    margin: 20px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .page-break {
                    page-break-before: always;
                }
            </style>
        `;

        // Add Title Page
        const titlePage = `
            <div class="title-page">
                <h1>Test Case Coverage Report</h1>
                <h3>Project ID: ${project_id}</h3>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
        `;

        // Add Project Information
        const projectInfo = `
            <div class="section">
                <h5>Project Information</h5>
                <p><strong>Project ID:</strong> ${project_id}</p>
                <p><strong>Total Test Cases:</strong> ${total_testcases}</p>
                <p><strong>Covered Test Cases:</strong> ${covered_testcases}</p>
                <p><strong>Coverage Percentage:</strong> ${coverage_percentage.toFixed(2)}%</p>
                <p><strong>Not Covered Percentage:</strong> ${notcovered_percentage.toFixed(2)}%</p>
            </div>
        `;

        exportContent.innerHTML += styles;
        exportContent.innerHTML += titlePage;
        exportContent.innerHTML += projectInfo;

        // Add Pie Chart Image
        const pieChart = pieChartRef.current;
        if (pieChart) {
            const pieCanvas = pieChart.canvas;
            const pieImage = pieCanvas.toDataURL("image/png");
            const img = document.createElement("img");
            img.src = pieImage;
            img.style.width = "50%"; // Set the desired width
            img.style.height = "auto"; // Maintain aspect ratio
            const pieChartSection = document.createElement("div");
            pieChartSection.classList.add("section");
            pieChartSection.innerHTML = "<h5>Coverage Pie Chart</h5>";
            pieChartSection.appendChild(img);
            exportContent.appendChild(pieChartSection);
        }

        // Add Covered Test Cases Table
        const coveredTestcasesTable = `
        <div class="section page-break">
            <div class="section">
                <h5>Covered Test Cases</h5>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Test Case ID</th>
                                <th>Test Plans</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${coveredTestcasesList.map(testcase => `
                                <tr>
                                    <td>${testcase.testcase_id}</td>
                                    <td>${testcase.testplans}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>    
        `;
        exportContent.innerHTML += coveredTestcasesTable;

        // Add Not Covered Test Cases Table
        const notCoveredTestcasesTable = `
            <div class="section">
                <h5>Not Covered Test Cases</h5>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Test Case ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${notCoveredTestcasesList.map(testcase => `
                                <tr>
                                    <td>${testcase.testcase_id}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        exportContent.innerHTML += notCoveredTestcasesTable;

        // Add Project Members Table
        const projectMembersTable = `
            <div class="section">
                <h5>Assigned Members</h5>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Member Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${project_members.map(member => `
                                <tr>
                                    <td>${member.name}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        exportContent.innerHTML += projectMembersTable;

        const opt = {
            margin: 1,
            filename: `TestCaseCoverageReport_${project_id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(exportContent).set(opt).save();
    };

    return (
        <div>
            <h2>Test Case Coverage Report</h2>
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h5>Project Information</h5>
                            <p><strong>Project ID:</strong> {project_id}</p>
                            <p><strong>Total Test Cases:</strong> {total_testcases}</p>
                            <p><strong>Covered Test Cases:</strong> {covered_testcases}</p>
                            <p><strong>Coverage Percentage:</strong> {coverage_percentage.toFixed(2)}%</p>
                            <p><strong>Not Covered Percentage:</strong> {notcovered_percentage.toFixed(2)}%</p>
                        </Col>
                        <Col md={6}>
                            <h5>Pie Chart</h5>
                            <div className="chart chart-sm">
                                <Pie data={data} ref={pieChartRef} />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5 className="mt-4">Covered Test Cases</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Test Case ID</th>
                                        <th>Test Plans</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coverage
                                        .filter(item => item.testplan_count > 0)
                                        .map(item => (
                                            <tr key={item.testcase_id}>
                                                <td>{item.testcase_id}</td>
                                                <td>{item.testplans.join(", ")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <h5 className="mt-4">Not Covered Test Cases</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Test Case ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coverage
                                        .filter(item => item.testplan_count === 0)
                                        .map(item => (
                                            <tr key={item.testcase_id}>
                                                <td>{item.testcase_id}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5 className="mt-4">Assigned Members</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        {/* <th>Member ID</th> */}
                                        <th>Member Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {project_members.map(member => (
                                        <tr key={member.id}>
                                            {/* <td>{member.id}</td> */}
                                            <td>{member.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-3">
                        <Button onClick={handleExportPDF} className="me-2">Export PDF</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TestCasesCoverageReport;
