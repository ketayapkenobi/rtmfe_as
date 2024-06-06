import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Card, Dropdown, Table } from "react-bootstrap";
import { MoreHorizontal } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import usePalette from "../../../hooks/usePalette";
import axios from "axios";

import { API_URL } from "../../../Api";

const PieChart = () => {
  const palette = usePalette();
  const [chartData, setChartData] = useState({
    labels: ["Covered", "Not Covered"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#93c47d", "#e06666"],
        borderWidth: 5,
        borderColor: palette.white,
      },
    ],
  });

  useEffect(() => {
    axios.get(`${API_URL}/dashboard/piechart-req`)
      .then(response => {
        const data = response.data;
        const covered = data.coveredRequirements;
        const notCovered = data.nonCoveredRequirements;

        setChartData({
          labels: ["Covered", "Not Covered"],
          datasets: [
            {
              data: [covered, notCovered],
              backgroundColor: ["#93c47d", "#e06666"],
              borderWidth: 5,
              borderColor: palette.white,
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching pie chart data:', error);
      });
  }, [palette]);

  const options = {
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
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
        <Card.Title className="mb-0">All Requirements Coverage</Card.Title>
      </Card.Header>
      <Card.Body className="d-flex">
        <div className="align-self-center w-100">
          <div className="py-3">
            <div className="chart chart-xs">
              <Pie data={chartData} options={options} />
            </div>
          </div>

          <Table className="mb-0">
            <thead>
              <tr>
                <th>Category</th>
                <th className="text-end">Count</th>
                <th className="text-end">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <FontAwesomeIcon icon={faSquare} className="text-primary" /> Covered
                </td>
                <td className="text-end">{chartData.datasets[0].data[0]}</td>
                <td className="text-end text-success">{((chartData.datasets[0].data[0] / (chartData.datasets[0].data[0] + chartData.datasets[0].data[1])) * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td>
                  <FontAwesomeIcon icon={faSquare} className="text-danger" /> Not Covered
                </td>
                <td className="text-end">{chartData.datasets[0].data[1]}</td>
                <td className="text-end text-danger">{((chartData.datasets[0].data[1] / (chartData.datasets[0].data[0] + chartData.datasets[0].data[1])) * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PieChart;
