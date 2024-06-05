import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Badge, Col, Card, Row, Modal, Button } from "react-bootstrap";
import { FileText, File, Clipboard } from "react-feather";
import illustration from "../../../assets/img/illustrations/customer-support.png";

import { API_URL } from "../../../Api";

const Statistics = ({ projectID }) => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    requirements_count: 0,
    test_cases_count: 0,
    test_plans_count: 0,
    covered_requirements_list: [],
    non_covered_requirements_list: [],
    covered_testcases_list: [],
    non_covered_testcases_list: [],
    covered_testplans_list: [],
    non_covered_testplans_list: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState([]);
  const [isHovered, setIsHovered] = useState(Array(6).fill(false));

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

    // Fetch project stats
    axios.get(`${API_URL}/projects/${projectID}/stats`)
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching project statistics:', error);
      });
  }, [projectID]);

  const handleShowModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalTitle('');
    setModalContent([]);
  };

  const handleMouseEnter = (index) => {
    setIsHovered((prev) => {
      const newHoveredState = [...prev];
      newHoveredState[index] = true;
      return newHoveredState;
    });
  };

  const handleMouseLeave = (index) => {
    setIsHovered((prev) => {
      const newHoveredState = [...prev];
      newHoveredState[index] = false;
      return newHoveredState;
    });
  };


  const clickableTextStyle = { cursor: "pointer" };

  return (
    <>
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
            <Card.Body className="py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{stats.requirements_count}</h3>
                  <p className="mb-2">Total Requirements</p>
                  <div className="mb-0">
                    <Badge bg="" className="badge-soft-success me-2">
                      {stats.covered_requirements}
                    </Badge>
                    <span
                      style={{ cursor: "pointer", textDecoration: "none" }}
                      onMouseEnter={() => handleMouseEnter(0)}
                      onMouseLeave={() => handleMouseLeave(0)}
                      onClick={() =>
                        handleShowModal(
                          "Covered Requirements",
                          stats.covered_requirements_list
                        )
                      }
                    >
                      Requirements Covered
                    </span>
                  </div>
                  <div className="mb-0">
                    <Badge bg="" className="badge-soft-danger me-2">
                      {stats.requirements_count - stats.covered_requirements}
                    </Badge>
                    <span
                      style={{ cursor: "pointer", textDecoration: "none" }}
                      onMouseEnter={() => handleMouseEnter(1)}
                      onMouseLeave={() => handleMouseLeave(1)}
                      onClick={() =>
                        handleShowModal(
                          "Remaining Requirements",
                          stats.non_covered_requirements_list
                        )
                      }
                    >
                      Remaining Requirements
                    </span>
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
            <Card.Body className="py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{stats.test_cases_count}</h3>
                  <p className="mb-2">Total Test Cases</p>
                  <div className="mb-0">
                    <Badge bg="" className="badge-soft-success me-2">
                      {stats.covered_testcases}
                    </Badge>
                    <span
                      style={{ cursor: "pointer", textDecoration: "none" }}
                      onMouseEnter={() => handleMouseEnter(0)}
                      onMouseLeave={() => handleMouseLeave(0)}
                      onClick={() =>
                        handleShowModal(
                          'Covered Test Cases',
                          stats.covered_testcases_list
                        )
                      }
                    >
                      Test Cases Covered
                    </span>
                  </div>
                  <div className="mb-0">
                    <Badge bg="" className="badge-soft-danger me-2">
                      {stats.test_cases_count - stats.covered_testcases}
                    </Badge>
                    <span
                      style={{ cursor: "pointer", textDecoration: "none" }}
                      onMouseEnter={() => handleMouseEnter(1)}
                      onMouseLeave={() => handleMouseLeave(1)}
                      onClick={() =>
                        handleShowModal(
                          'Remaining Test Cases',
                          stats.non_covered_testcases_list
                        )
                      }
                    >
                      Remaining Test Cases
                    </span>
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
            <Card.Body className="py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{stats.test_plans_count}</h3>
                  <p className="mb-2">Total Test Plans</p>
                  <div className="mb-0">
                    <Badge bg="" className="badge-soft-success me-2">
                      {stats.covered_testplans}
                    </Badge>
                    <span
                      style={{ cursor: "pointer", textDecoration: "none" }}
                      onMouseEnter={() => handleMouseEnter(0)}
                      onMouseLeave={() => handleMouseLeave(0)}
                      onClick={() =>
                        handleShowModal(
                          'Covered Test Plans',
                          stats.covered_testplans_list
                        )
                      }
                    >
                      Test Plans Covered
                    </span>
                  </div>
                  <div className="mb-0">
                    <Badge bg="" className="badge-soft-danger me-2">
                      {stats.test_plans_count - stats.covered_testplans}
                    </Badge>
                    <span
                      style={clickableTextStyle}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onClick={() =>
                        handleShowModal(
                          'Remaining Test Plans',
                          stats.non_covered_testplans_list
                        )
                      }
                    >
                      Remaining Test Plans
                    </span>
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {modalContent.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Statistics;

