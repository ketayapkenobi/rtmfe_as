import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Dropdown } from "react-bootstrap";
import { Settings, User } from "react-feather";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { API_URL } from "../../Api";

const NavbarUser = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

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
          const user = await response.json();
          setUserName(user.name);
          setUserRole(user.role); // Set user's role
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const authToken = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        console.log("Logged out successfully");
        navigate("/auth/sign-in");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNavigateToProfile = () => {
    navigate("/pages/profile");
  };

  return (
    <Dropdown className="nav-item" align="end">
      <span className="d-inline-block d-sm-none">
        <Dropdown.Toggle as="a" className="nav-link">
          <Settings size={18} className="align-middle" />
        </Dropdown.Toggle>
      </span>
      <span className="d-none d-sm-inline-block">
        <Dropdown.Toggle as="a" className="nav-link">
          <FontAwesomeIcon icon={faUser} style={{ fontSize: '16px' }} className="align-middle me-1" />
          <span className="text-dark">{userName} ({userRole})</span> {/* Display user's role */}
        </Dropdown.Toggle>
      </span>
      <Dropdown.Menu drop="end">
        <Dropdown.Item onClick={handleNavigateToProfile}>
          <User size={18} className="align-middle me-2" />
          Profile
        </Dropdown.Item>
        <Dropdown.Item>
          <Settings size={18} className="align-middle me-2" />
          Settings
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarUser;
