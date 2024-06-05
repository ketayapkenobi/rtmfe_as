import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Card } from "react-bootstrap";
import usePalette from "../../../hooks/usePalette";
import axios from "axios";

const BarChart = () => {
  const palette = usePalette();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/dashboard/barchart")
      .then(response => {
        setProjects(response.data.projects);
      })
      .catch(error => {
        console.error('Error fetching bar chart data:', error);
      });
  }, []);

  const data = {
    labels: projects.map((project) => project.projectID),
    datasets: [
      {
        label: "Total Requirements",
        backgroundColor: palette.primary,
        data: projects.map((project) => project.totalRequirements),
        stack: "stack",
      },
      {
        label: "Total Test Cases",
        backgroundColor: palette.secondary,
        data: projects.map((project) => project.totalTestCases),
        stack: "stack",
      },
      {
        label: "Total Test Plans",
        backgroundColor: palette.success,
        data: projects.map((project) => project.totalTestPlans),
        stack: "stack",
      },
      {
        label: "Total Test Executions",
        backgroundColor: palette.warning,
        data: projects.map((project) => project.totalTestExecutions),
        stack: "stack",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cornerRadius: 15,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 5,
        },
        stacked: true,
      },
      x: {
        grid: {
          color: "transparent",
        },
        stacked: true,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    elements: {
      bar: {
        borderRadius: 10, // Adjust the border radius as needed
      },
    },
  };

  return (
    <Card className="flex-fill w-100">
      <Card.Header>
        <Card.Title className="mb-0">Total Artefacts</Card.Title>
      </Card.Header>
      <Card.Body className="d-flex">
        <div className="align-self-center w-100">
          <div className="chart chart-lg">
            <Bar data={data} options={options} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BarChart;
