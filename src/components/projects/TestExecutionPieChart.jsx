import React from "react";
import { Card } from "react-bootstrap";
import { Pie } from "react-chartjs-2";

const TestExecutionPieChart = ({ progressData, legendLabels, getBackgroundColor, palette }) => {
    const data = {
        labels: legendLabels,
        datasets: [
            {
                data: progressData ? Object.values(progressData) : [],
                backgroundColor: legendLabels.map(getBackgroundColor),
                borderWidth: 1,
                borderColor: palette.white,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    return (
        <div className="mt-3">
            <Card>
                <Card.Header>
                    <Card.Title>Pie Chart</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="chart chart-sm">
                        <Pie
                            data={data}
                            options={options}
                        />
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TestExecutionPieChart;
