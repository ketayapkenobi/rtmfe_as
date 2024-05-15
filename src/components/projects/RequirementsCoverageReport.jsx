import React from "react";
import { Card, Row, Col, Table } from "react-bootstrap";
import { Pie } from "react-chartjs-2";

const RequirementsCoverageReport = ({ generatedReport }) => {
    const { project_id, total_requirements, covered_requirements, coverage_percentage, notcovered_percentage, coverage } = generatedReport;

    const legendLabels = ["Covered", "Not Covered"];
    const progressData = [covered_requirements, total_requirements - covered_requirements];

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

    const coveredRequirementsList = coverage
        .filter((item) => item.testcase_count > 0)
        .map((item) => (
            <tr key={item.requirement_id}>
                <td>{item.requirement_id}</td>
                <td>{item.testcases.join(", ")}</td>
            </tr>
        ));

    const notCoveredRequirementsList = coverage
        .filter((item) => item.testcase_count === 0)
        .map((item) => <tr key={item.requirement_id}><td>{item.requirement_id}</td></tr>);

    return (
        <div>
            <h2>Requirements Coverage Report</h2>
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h5>Project Information</h5>
                            <p><strong>Project ID:</strong> {project_id}</p>
                            <p><strong>Total Requirements:</strong> {total_requirements}</p>
                            <p><strong>Covered Requirements:</strong> {covered_requirements}</p>
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
                            <h5 className="mt-4">Covered Requirements</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Requirement ID</th>
                                        <th>Test Cases</th>
                                    </tr>
                                </thead>
                                <tbody>{coveredRequirementsList}</tbody>
                            </Table>
                        </Col>
                        <Col>
                            <h5 className="mt-4">Not Covered Requirements</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Requirement ID</th>
                                    </tr>
                                </thead>
                                <tbody>{notCoveredRequirementsList}</tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RequirementsCoverageReport;
