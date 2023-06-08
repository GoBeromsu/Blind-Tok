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

const IconBarOpen = () => {
  let navigate = useNavigate();
  const cookies = new Cookies();
  const handleLogout = () => {
    cookies.remove("access_token", {path: "/", domain: "localhost"});
    navigate("/login");
  };

  return (
    <>
      <div className="iconbar_open">
        <Link to="/friend">
          <IconButton>
            <PeopleIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Friend List</span>
          </IconButton>
        </Link>
        <Link to="/upload">
          <IconButton>
            <UploadIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; File Upload</span>
          </IconButton>
        </Link>
        <Br />
        <br />
        <Link to="/User">
          <IconButton style={{paddingRight: "30px"}}>
            <SearchIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Search</span>
          </IconButton>
        </Link>

        <Link to="/chat">
          <IconButton>
            <ChatIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Chatting</span>
          </IconButton>
        </Link>
        <Br />
        <br />
        <Link to="/notification">
          <IconButton style={{paddingRight: "35px"}}>
            <NotificationsIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Alarm</span>
          </IconButton>
        </Link>
        <Link to="/User">
          <IconButton>
            <SettingsIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Setting</span>
          </IconButton>
        </Link>
        <Br />
        <Br />
        <div className="item" onClick={handleLogout} style={{paddingLeft: "125px"}}>
          <IconButton>
            <LogoutIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Logout</span>
          </IconButton>
          <Br />
        </div>
      </div>
    </>
  );
};

export default IconBarOpen;
