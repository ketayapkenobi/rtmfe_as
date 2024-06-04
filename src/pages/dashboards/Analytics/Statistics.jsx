import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Badge, Col, Card, Row } from "react-bootstrap";
import { DollarSign, ShoppingBag, FileText, File, Clipboard } from "react-feather";
import illustration from "../../../assets/img/illustrations/customer-support.png";

const Statistics = ({ projectID }) => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    requirements_count: 0,
    test_cases_count: 0,
    test_plans_count: 0,
  });

  useEffect(() => {
    // Fetch current user
    axios.get('http://localhost:8000/api/current-user', {
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

    // Fetch project stats
    axios.get(`http://localhost:8000/api/projects/${projectID}/stats`)
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching project statistics:', error);
      });
  }, [projectID]);

  return (
    <Row>
      <Col md="6" xl className="d-flex">
        <Card className="illustration flex-fill">
          <Card.Body className="p-0 d-flex flex-fill">
            <Row className="g-0 w-100">
              <Col xs="6">
                <div className="illustration-text p-3 m-1">
                  <h4 className="illustration-text">
                    {t("Welcome back")}, {userName}!
                  </h4>
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
                <h3 className="mb-2">{stats.requirements_count}</h3>
                <p className="mb-2">Total Requirements</p>
                <div className="mb-0">
                  <Badge bg="" className="badge-soft-success me-2">
                    {stats.covered_requirements}
                  </Badge>
                  <span className="text-muted">Requirements Covered</span>
                </div>
                <div className="mb-0">
                  <Badge bg="" className="badge-soft-danger me-2">
                    {stats.requirements_count - stats.covered_requirements}
                  </Badge>
                  <span className="text-muted">Remaining Requirements</span>
                </div>
              </div>
              <div className="d-inline-block ms-3">
                <div className="stat">
                  <FileText className="align-middle text-success" />
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
                <h3 className="mb-2">{stats.test_cases_count}</h3>
                <p className="mb-2">Total Test Cases</p>
                <div className="mb-0">
                  <Badge bg="" className="badge-soft-success me-2">
                    {stats.covered_testcases}
                  </Badge>
                  <span className="text-muted">Test Cases Covered</span>
                </div>
                <div className="mb-0">
                  <Badge bg="" className="badge-soft-danger me-2">
                    {stats.test_cases_count - stats.covered_testcases}
                  </Badge>
                  <span className="text-muted">Remaining Test Cases</span>
                </div>
              </div>
              <div className="d-inline-block ms-3">
                <div className="stat">
                  <File className="align-middle text-success" />
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
                <h3 className="mb-2">{stats.test_plans_count}</h3>
                <p className="mb-2">Total Test Plans</p>
                <div className="mb-0">
                  <Badge bg="" className="badge-soft-success me-2">
                    {stats.covered_testplans}
                  </Badge>
                  <span className="text-muted">Test Plans Covered</span>
                </div>
                <div className="mb-0">
                  <Badge bg="" className="badge-soft-danger me-2">
                    {stats.test_plans_count - stats.covered_testplans}
                  </Badge>
                  <span className="text-muted">Remaining Test Plans</span>
                </div>
              </div>
              <div className="d-inline-block ms-3">
                <div className="stat">
                  <Clipboard className="align-middle text-success" />
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
