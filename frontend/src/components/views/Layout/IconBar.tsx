import React from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {IconButton} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import UploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Br from "./Br";
import {Cookies} from "react-cookie";
const IconBar = () => {
  let navigate = useNavigate();
  const cookies = new Cookies();
  const handleLogout = () => {
    cookies.remove("access_token", {path: "/", domain: "localhost"});
    navigate("/login");
  };

  return (
    <>
      <div className="icon_sidebar">
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
          <Link to="/User">
            <IconButton>
              <SearchIcon style={{fontSize: 28}} />
            </IconButton>
          </Link>
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
        <div className="item" onClick={handleLogout}>
          <IconButton>
            <LogoutIcon style={{fontSize: 28}} />
          </IconButton>
          <Br />
        </div>
      </div>
    </>
  );
};

export default IconBar;
