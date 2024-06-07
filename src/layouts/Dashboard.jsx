import React, { useEffect, useState, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Wrapper from "../components/Wrapper";
import Sidebar from "../components/sidebar/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/navbar/Navbar";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Settings from "../components/Settings";
import Loader from "../components/Loader";

import dashboardItems from "../components/sidebar/dashboardItems";

import { API_URL } from "../Api";

const Dashboard = ({ children }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const isUserLoggedIn = () => !!localStorage.getItem("token");

    if (!isUserLoggedIn()) {
      navigate("/auth/sign-in");
    } else {
      const fetchData = async () => {
        const authToken = localStorage.getItem("token");
        try {
          const userResponse = await fetch(`${API_URL}/current-user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserRole(userData.role);
          } else {
            console.error("Failed to fetch current user");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [navigate]);

  if (userRole === null) {
    return <Loader />; // Or a loading spinner, etc.
  }

  const navItems = dashboardItems(userRole);

  return (
    <React.Fragment>
      <Wrapper>
        <Sidebar items={navItems} />
        <Main>
          <Navbar />
          <Content>
            <Suspense fallback={<Loader />}>
              {children}
              <Outlet />
            </Suspense>
          </Content>
          <Footer />
        </Main>
      </Wrapper>
      {/* <Settings /> */}
    </React.Fragment>
  );
};

export default Dashboard;
