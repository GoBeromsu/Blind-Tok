import React, {useEffect, useState, Component} from "react";
import {connect} from "react-redux";
import "../style/App.css";
import SideBar from "./SideBar";
import UserProfile from "./UserProfile";
import RegisterPage from "./RegisterPage";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(windowWidth <= 768 ? 50 : 200);
  const [contentWidth, setContentWidth] = useState(windowWidth - sidebarWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setSidebarWidth(windowWidth <= 768 ? 50 : 332);
    setContentWidth(windowWidth - sidebarWidth);
  }, [windowWidth, sidebarWidth]);

  return (
    <div className="container">
      <div className="sidebar" style={{width: sidebarWidth, height: "100vh"}}>
        <SideBar />
      </div>
      <div className="content" style={{width: contentWidth, height: "100vh"}}>
        {/* <UserProfile /> */}
        <Router>
          <Routes>
            <Route path="/" element={<RegisterPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    counter: state.counter,
  };
};

export default connect(mapStateToProps)(App);
