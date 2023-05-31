import React, {useState, useEffect} from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import BTlogo from "@views/svgImg/BTlogo";
import C_Image from "@views/Layout/CircularImage";
import "@style/SideBar.css";
import Br from "./Br";
import IconBar from "./IconBar";

const SideBar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const defaultImg = "/image/l.png";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{display: "flex"}}>
      <div className={`sidebar${sidebarOpen ? "" : " closed"}`} style={{display: "flex", flexDirection: "row"}}>
        <div className="sidebar_main">
          <div onClick={() => navigate("/")}>
            <Link to="/">
              <BTlogo />
            </Link>
          </div>
          <Br />
          <Br />
          <C_Image src={defaultImg} alt="Profile image" size="130" />
          <Br />
        </div>
        <div className="sidebar_separator"></div>
        <IconBar />
      </div>
      <Outlet />
    </div>
  );
};

export default SideBar;
