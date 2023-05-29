import React, {useState, useEffect} from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import BTlogo from "@views/svgImg/BTlogo";
import C_Image from "@views/Layout/CircularImage";
import {IconButton} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import UploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import "@style/SideBar.css";
import Br from "./Br";

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
          <C_Image src={defaultImg} alt="Profile image" size="130" />
        </div>
        <div className="icon_sidebar" style={{display: "flex", flexDirection: "column"}}>
          <div className="item">
            <Link to="/friend">
              <IconButton>
                <PeopleIcon style={{fontSize: 28}} />
              </IconButton>
            </Link>
            <Br />
          </div>
          <div className="item">
            <Link to="/upload">
              <IconButton>
                <UploadIcon style={{fontSize: 28}} />
              </IconButton>
            </Link>
            <Br />
          </div>
          <div className="item">
            <IconButton>
              <SearchIcon style={{fontSize: 28}} />
            </IconButton>
            <Br />
          </div>
          <div className="item">
            <Link to="/chat">
              <IconButton>
                <ChatIcon style={{fontSize: 28}} />
              </IconButton>
            </Link>
            <Br />
          </div>
          <div className="item">
            <IconButton>
              <NotificationsIcon style={{fontSize: 28}} />
            </IconButton>
            <Br />
          </div>
          <div className="item">
            <Link to="/User">
              <IconButton>
                <SettingsIcon style={{fontSize: 28}} />
              </IconButton>
            </Link>
            <Br />
          </div>
          <div className="item">
            <IconButton>
              <LogoutIcon style={{fontSize: 28}} />
            </IconButton>
            <Br />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default SideBar;
