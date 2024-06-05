import React, { useState, useEffect } from "react";
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
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/dashboard/piechart`)
      .then(response => {
        setUserStats(response.data.userStats);
      })
      .catch(error => {
        console.error('Error fetching pie chart data:', error);
      });
  }, []);

  const data = {
    labels: userStats.map((userStat) => userStat.roleName),
    datasets: [
      {
        data: userStats.map((userStat) => userStat.percentage),
        backgroundColor: [
          palette.primary,
          palette.warning,
          palette.danger,
          "#E8EAED",
        ],
        borderWidth: 5,
        borderColor: palette.white,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const colors = ["primary", "warning", "danger", "dark"];

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
        <Card.Title className="mb-0">User Roles</Card.Title>
      </Card.Header>
      <Card.Body className="d-flex">
        <div className="align-self-center w-100">
          <div className="py-3">
            <div className="chart chart-xs">
              <Pie data={data} options={options} />
            </div>
          </div>

          <Table className="mb-0">
            <thead>
              <tr>
                <th>Source</th>
                <th className="text-end">Users</th>
                <th className="text-end">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((userStat, index) => (
                <tr key={index}>
                  <td>
                    <FontAwesomeIcon
                      icon={faSquare}
                      style={{ color: palette[colors[index]] }}
                    />{" "}
                    {userStat.roleName}
                  </td>
                  <td className="text-end">{userStat.total}</td>
                  <td className="text-end text-success">{userStat.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PieChart;
