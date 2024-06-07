import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Header from "./Header";
import Appointments from "./Appointments";
import BarChart from "./BarChart";
import BarChartReq from "./BarChartReq";
import Calendar from "./Calendar";
import Feed from "./Feed";
import PieChart from "./PieChart";
import PieChartReq from "./PieChartReq";
import Projects from "./Projects";
import Statistics from "./Statistics";

import { API_URL } from "../../../Api";

// Mock function to check if a user is logged in
// Replace this with your actual authentication logic
const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  console.log("Checking user token:", token); // Debugging line
  return !!token;
};

const Default = () => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isUserLoggedIn()) {
        navigate('/auth/sign-in');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/current-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }

        const userData = await response.json();
        setUserID(userData.userID);
        setUserRole(userData.role); // assuming role is available in the response
      } catch (error) {
        console.error("Error fetching current user:", error);
        // Handle error here, e.g., show an error message or retry the fetch
      }
    };

    fetchData();
  }, [navigate]);

  if (userID === null) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Helmet title="Artemiz Dashboard" />
      <Container fluid className="p-0">
        <Header />
        <Statistics />
        <Row>
          <Col lg="8" className="d-flex">
            <BarChartReq userID={userID} />
          </Col>
          {userRole !== 'Client' ? (
            <Col lg="4" className="d-flex">
              <PieChartReq />
            </Col>
          ) : (
            <Col lg="4" className="d-flex">
              <Projects userID={userID} />
            </Col>
          )}
        </Row>
        <Row>
          <Col lg="8" className="d-flex">
            <BarChart userID={userID} />
          </Col>
          {userRole !== 'Client' && (
            <Col lg="4" className="d-flex">
              <PieChart />
            </Col>
          )}
        </Row>
        {userRole !== 'Client' && (
          <Projects userID={userID} />
        )}
      </Container>
    </React.Fragment>
  );
};

export default Default;
