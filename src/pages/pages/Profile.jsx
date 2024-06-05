import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Briefcase, Home, MapPin, MessageSquare } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import avatar1 from "../../assets/img/avatars/avatar.jpg";
import avatar2 from "../../assets/img/avatars/avatar-2.jpg";
import avatar4 from "../../assets/img/avatars/avatar-4.jpg";
import avatar5 from "../../assets/img/avatars/avatar-5.jpg";
import unsplash1 from "../../assets/img/photos/unsplash-1.jpg";
import unsplash2 from "../../assets/img/photos/unsplash-2.jpg";

import { API_URL } from "../../Api";

const ProfileDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const authToken = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/current-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">Profile Details</Card.Title>
      </Card.Header>
      <Card.Body className="text-center">
        {user ? (
          <>
            <Card.Title className="mb-0">{user.name}</Card.Title>
            <div className="text-muted mb-2">{user.role}</div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Card.Body>
    </Card>
  );
};

const Activities = () => (
  <Card>
    <Card.Header>
      <Card.Title className="mb-0">Activities</Card.Title>
    </Card.Header>
    <Card.Body>
      <div className="d-flex">
        <img
          src={avatar5}
          width="36"
          height="36"
          className="rounded-circle me-2"
          alt="Ashley Briggs"
        />
        <div className="flex-grow-1">
          <small className="float-end text-navy">5m ago</small>
          <strong>Ashley Briggs</strong> started following{" "}
          <strong>Stacie Hall</strong>
          <br />
          <small className="text-muted">Today 7:51 pm</small>
          <br />
        </div>
      </div>

      <hr />
      <div className="d-flex">
        <img
          src={avatar1}
          width="36"
          height="36"
          className="rounded-circle me-2"
          alt="Chris Wood"
        />
        <div className="flex-grow-1">
          <small className="float-end text-navy">30m ago</small>
          <strong>Chris Wood</strong> posted something on{" "}
          <strong>Stacie Hall</strong>'s timeline
          <br />
          <small className="text-muted">Today 7:21 pm</small>
          <div className="border text-sm text-muted p-2 mt-1">
            Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem
            quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam
            quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.
            Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut
            libero venenatis faucibus. Nullam quis ante.
          </div>
          <Button size="sm" variant="danger" className="mt-1">
            <FontAwesomeIcon icon={faHeart} fixedWidth /> Like
          </Button>
        </div>
      </div>

      <hr />
      <div className="d-flex">
        <img
          src={avatar4}
          width="36"
          height="36"
          className="rounded-circle me-2"
          alt="Stacie Hall"
        />
        <div className="flex-grow-1">
          <small className="float-end text-navy">1h ago</small>
          <strong>Stacie Hall</strong> posted a new blog
          <br />
          <small className="text-muted">Today 6:35 pm</small>
        </div>
      </div>

      <hr />
      <div className="d-flex">
        <img
          src={avatar2}
          width="36"
          height="36"
          className="rounded-circle me-2"
          alt="Carl Jenkins"
        />
        <div className="flex-grow-1">
          <small className="float-end text-navy">3h ago</small>
          <strong>Carl Jenkins</strong> posted two photos on{" "}
          <strong>Stacie Hall</strong>'s timeline
          <br />
          <small className="text-muted">Today 5:12 pm</small>
          <div className="row no-gutters mt-1">
            <div className="col-6 col-md-4 col-lg-4 col-xl-3">
              <img src={unsplash1} className="img-fluid pe-2" alt="Unsplash" />
            </div>
            <div className="col-6 col-md-4 col-lg-4 col-xl-3">
              <img src={unsplash2} className="img-fluid pe-2" alt="Unsplash" />
            </div>
          </div>
          <Button size="sm" variant="danger" className="mt-1">
            <FontAwesomeIcon icon={faHeart} fixedWidth /> Like
          </Button>
        </div>
      </div>

      <hr />
      <div className="d-flex">
        <img
          src={avatar2}
          width="36"
          height="36"
          className="rounded-circle me-2"
          alt="Carl Jenkins"
        />
        <div className="flex-grow-1">
          <small className="float-end text-navy">1d ago</small>
          <strong>Carl Jenkins</strong> started following{" "}
          <strong>Stacie Hall</strong>
          <br />
          <small className="text-muted">Yesterday 3:12 pm</small>
          <div className="d-flex mt-1">
            <img
              src={avatar4}
              width="36"
              height="36"
              className="rounded-circle me-2"
              alt="Stacie Hall"
            />
            <div className="flex-grow-1 ps-3">
              <div className="border text-sm text-muted p-2 mt-1">
                Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id,
                lorem. Maecenas nec odio et ante tincidunt tempus.
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="d-flex">
        <img
          src={avatar4}
          width="36"
          height="36"
          className="rounded-circle me-2"
          alt="Stacie Hall"
        />
        <div className="flex-grow-1">
          <small className="float-end text-navy">1d ago</small>
          <strong>Stacie Hall</strong> posted a new blog
          <br />
          <small className="text-muted">Yesterday 2:43 pm</small>
        </div>
      </div>

      <hr />
      <div className="d-flex">
        <img
          src={avatar1}
          width="36"
          height="36"
          className="rounded-circle me-2"
          alt="Chris Wood"
        />
        <div className="flex-grow-1">
          <small className="float-end text-navy">1d ago</small>
          <strong>Chris Wood</strong> started following{" "}
          <strong>Stacie Hall</strong>
          <br />
          <small className="text-muted">Yesterday 1:51 pm</small>
        </div>
      </div>
    </Card.Body>
  </Card>
);

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        navigate("/auth/sign-in");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleEditProfile = () => {
    navigate("/settings");
  };

  if (!isAuthenticated) {
    return null; // or a loading indicator
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Profile | My App</title>
      </Helmet>
      <Container className="p-0">
        <h1 className="h3 mb-3">Profile</h1>

        <Row>
          <Col md="4" xl="3">
            <ProfileDetails />
          </Col>
          <Col md="8" xl="9">
            {/* <Activities /> */}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Profile;
