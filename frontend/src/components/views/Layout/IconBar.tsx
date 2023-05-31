import React from "react";
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

const IconBar = () =>{
  return <>
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
        </div></>
}

export default IconBar;