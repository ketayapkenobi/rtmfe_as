import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Dropdown } from "react-bootstrap";
import { PieChart, Settings, User } from "react-feather";
import avatar1 from "../../assets/img/avatars/avatar.jpg";

const NavbarUser = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const authToken = localStorage.getItem('token');
      try {
        const response = await fetch("http://localhost:8000/api/current-user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const user = await response.json();
          setUserName(user.name);
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
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        // Remove the token from localStorage on successful logout
        localStorage.removeItem('authToken');
        console.log("Logged out successfully");
        navigate("/auth/sign-in"); // Redirect to sign-in page
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
          <img
            src={avatar1}
            className="avatar img-fluid rounded-circle me-1"
            alt="Chris Wood"
          />
          <span className="text-dark">{userName}</span>
        </Dropdown.Toggle>
      </span>
      <Dropdown.Menu drop="end">
        <Dropdown.Item onClick={handleNavigateToProfile}>
          <User size={18} className="align-middle me-2" />
          Profile
        </Dropdown.Item>
        <Dropdown.Item>
          <PieChart size={18} className="align-middle me-2" />
          Analytics
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Settings & Privacy</Dropdown.Item>
        <Dropdown.Item>Help</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarUser;
