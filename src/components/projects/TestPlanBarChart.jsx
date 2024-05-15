import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import usePalette from '../../hooks/usePalette';

const TestPlanBarChart = ({ testExecutionsProgress }) => {
    const palette = usePalette();

    // Prepare data for chart
    const chartData = {
        labels: testExecutionsProgress.map(item => item.testexecutionID),
        datasets: [
            {
                label: 'Pass',
                backgroundColor: '#27ae60',
                data: testExecutionsProgress.map(item => item.progress.find(p => p.result_id === 3)?.percentage || 0),
            },
            {
                label: 'Fail',
                backgroundColor: '#e74c3c',
                data: testExecutionsProgress.map(item => item.progress.find(p => p.result_id === 4)?.percentage || 0),
            },
            {
                label: 'Blocked',
                backgroundColor: '#9b59b6',
                data: testExecutionsProgress.map(item => item.progress.find(p => p.result_id === 5)?.percentage || 0),
            },
            {
                label: 'Passed with Restriction',
                backgroundColor: '#f39c12',
                data: testExecutionsProgress.map(item => item.progress.find(p => p.result_id === 6)?.percentage || 0),
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                },
            },
            y: {
                stacked: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                },
            },
        },
    };

    return (
        <div className="mt-3">
            <Card>
                <Card.Header>
                    <Card.Title>Test Plan Bar Chart</Card.Title>
                    <h6 className="card-subtitle text-muted">
                        Progess and result of each test executions
                    </h6>
                </Card.Header>
                <Card.Body>
                    <div className="chart">
                        <Bar data={chartData} options={options} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default TestPlanBarChart;
