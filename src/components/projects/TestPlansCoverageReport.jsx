import React from "react";
import { Card, Row, Col, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";

const TestPlansCoverageReport = ({ generatedReport }) => {
    const { project_id, total_testplans, covered_testplans, coverage_percentage, notcovered_percentage, coverage } = generatedReport;

    const legendLabels = ["Covered", "Not Covered"];
    const progressData = [covered_testplans, total_testplans - covered_testplans];

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

    const coveredTestplansList = coverage
        .filter((item) => item.testexecution_count > 0)
        .map((item) => (
            <tr key={item.testplanID}>
                <td>{item.testplanID}</td>
                <td>{item.testexecutions.join(", ")}</td>
            </tr>
        ));

    const notCoveredTestplansList = coverage
        .filter((item) => item.testexecution_count === 0)
        .map((item) => <tr key={item.testplanID}><td>{item.testplanID}</td></tr>);

    return (
        <div>
            <h2>Test Plan Coverage Report</h2>
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h5>Project Information</h5>
                            <p><strong>Project ID:</strong> {project_id}</p>
                            <p><strong>Total Test Plans:</strong> {total_testplans}</p>
                            <p><strong>Covered Test Plans:</strong> {covered_testplans}</p>
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
                            <h5 className="mt-4">Covered Test Plans</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Test Plan ID</th>
                                        <th>Test Executions</th>
                                    </tr>
                                </thead>
                                <tbody>{coveredTestplansList}</tbody>
                            </Table>
                        </Col>
                        <Col>
                            <h5 className="mt-4">Not Covered Test Plans</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Test Plan ID</th>
                                    </tr>
                                </thead>
                                <tbody>{notCoveredTestplansList}</tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TestPlansCoverageReport;
