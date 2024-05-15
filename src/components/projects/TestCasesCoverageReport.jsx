import React from "react";
import { Card, Row, Col, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";

const TestCasesCoverageReport = ({ generatedReport }) => {
    const { project_id, total_testcases, covered_testcases, coverage_percentage, notcovered_percentage, coverage } = generatedReport;

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
        .map((item) => (
            <tr key={item.testcase_id}>
                <td>{item.testcase_id}</td>
                <td>{item.testplans.join(", ")}</td>
            </tr>
        ));

    const notCoveredTestcasesList = coverage
        .filter((item) => item.testplan_count === 0)
        .map((item) => <tr key={item.testcase_id}><td>{item.testcase_id}</td></tr>);

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
                                <Pie data={data} />
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
                                <tbody>{coveredTestcasesList}</tbody>
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
                                <tbody>{notCoveredTestcasesList}</tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TestCasesCoverageReport;
