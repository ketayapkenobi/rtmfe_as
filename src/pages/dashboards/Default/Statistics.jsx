import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Badge, Col, Card, Row } from "react-bootstrap";
import { Book, Users } from "react-feather";
import illustration from "../../../assets/img/illustrations/customer-support.png";

import { API_URL } from "../../../Api";

const Statistics = () => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [projectsCount, setProjectsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    // Fetch current user
    axios.get(`${API_URL}/current-user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // assuming you store your token in localStorage
      }
    })
      .then(response => {
        setUserName(response.data.name);
      })
      .catch(error => {
        console.error('Error fetching current user:', error);
      });

    // Fetch total projects and users
    axios.get(`${API_URL}/dashboard`)
      .then(response => {
        setProjectsCount(response.data.projects_count);
        setUsersCount(response.data.users_count);
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
      });
  }, []);

  return (
    <Row>
      <Col md="6" xl className="d-flex">
        <Card className="illustration flex-fill">
          <Card.Body className="p-0 d-flex flex-fill">
            <Row className="g-0 w-100">
              <Col xs="6">
                <div className="illustration-text p-3 m-1">
                  <h4 className="illustration-text">
                    {t("Welcome back")}, {userName}!!
                  </h4>
                  {/* <p className="mb-0">Artemiz</p> */}
                </div>
              </Col>
              <Col xs={6} className="align-self-end text-end">
                <img
                  src={illustration}
                  alt="Customer Support"
                  className="img-fluid illustration-img"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col md="6" xl className="d-flex">
        <Card className="flex-fill">
          <Card.Body className=" py-4">
            <div className="d-flex align-items-start">
              <div className="flex-grow-1">
                <h3 className="mb-2">{projectsCount}</h3>
                <p className="mb-2">Total Projects</p>
              </div>
              <div className="d-inline-block ms-3">
                <div className="stat">
                  <Book className="align-middle text-success" />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md="6" xl className="d-flex">
        <Card className="flex-fill">
          <Card.Body className=" py-4">
            <div className="d-flex align-items-start">
              <div className="flex-grow-1">
                <h3 className="mb-2">{usersCount}</h3>
                <p className="mb-2">Total Users</p>
              </div>
              <div className="d-inline-block ms-3">
                <div className="stat">
                  <Users className="align-middle text-success" />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Statistics;
