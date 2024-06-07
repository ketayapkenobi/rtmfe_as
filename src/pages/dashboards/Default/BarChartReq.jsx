import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Card, Dropdown } from "react-bootstrap";
import { MoreHorizontal } from "react-feather";
import usePalette from "../../../hooks/usePalette";

import { API_URL } from "../../../Api";

const BarChart = ({ userID }) => {
  const [projects, setProjects] = useState([]);
  const palette = usePalette();

  useEffect(() => {
    axios.get(`${API_URL}/dashboard/barchart-req/${userID}`)
      .then(response => {
        setProjects(response.data.coverageStats);
      })
      .catch(error => {
        console.error('Error fetching bar chart req data:', error);
      });
  }, []);

  const data = {
    labels: projects.map(project => project.projectID),
    datasets: [
      {
        label: "Covered Requirements",
        backgroundColor: palette.primary,
        borderColor: palette.primary,
        hoverBackgroundColor: palette.primary,
        hoverBorderColor: palette.primary,
        data: projects.map(project => project.coveredRequirements),
        barPercentage: 0.325,
        categoryPercentage: 0.5,
      },
      {
        label: "Not-Covered Requirements",
        backgroundColor: palette["primary-light"],
        borderColor: palette["primary-light"],
        hoverBackgroundColor: palette["primary-light"],
        hoverBorderColor: palette["primary-light"],
        data: projects.map(project => project.nonCoveredRequirements),
        barPercentage: 0.325,
        categoryPercentage: 0.5,
        borderRadius: 99,
        borderSkipped: "bottom",
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
          stepSize: 1,
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
  };

  return (
    <Card className="flex-fill w-100">
      <Card.Header>
        <div className="card-actions float-end">
          <Dropdown align="end">
            <Dropdown.Toggle as="a" bsPrefix="-">
              <MoreHorizontal />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Action</Dropdown.Item>
              <Dropdown.Item>Another Action</Dropdown.Item>
              <Dropdown.Item>Something else here</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Card.Title className="mb-0">Requirements Coverage by Project</Card.Title>
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
