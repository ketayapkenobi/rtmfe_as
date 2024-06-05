import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Header from "./Header";
import Appointments from "./Appointments";
import BarChart from "./BarChart";
import Calendar from "./Calendar";
import Feed from "./Feed";
import PieChart from "./PieChart";
import Projects from "./Projects";
import Statistics from "./Statistics";

// Mock function to check if a user is logged in
// Replace this with your actual authentication logic
const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  console.log("Checking user token:", token); // Debugging line
  return !!token;
};

const Default = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/auth/sign-in');
    }
  }, []); // Simplified dependency array

  return (
    <React.Fragment>
      <Helmet title="Artemiz Dashboard" />
      <Container fluid className="p-0">
        <Header />
        <Statistics />
        <Row>
          <Col lg="8" className="d-flex">
            <BarChart />
          </Col>
          <Col lg="4" className="d-flex">
            {/* <Feed /> */}
            <PieChart />
          </Col>
        </Row>
        {/* <Row>
          <Col lg="6" xl="4" className="d-flex">
            <Calendar />
          </Col>
          <Col lg="6" xl="4" className="d-flex">
            <PieChart />
          </Col>
          <Col lg="6" xl="4" className="d-flex">
            <Appointments />
          </Col>
        </Row> */}
        <Projects />
      </Container>
    </React.Fragment>
  );
};

export default Default;
