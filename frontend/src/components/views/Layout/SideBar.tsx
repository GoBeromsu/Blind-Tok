import React, {useState, useEffect} from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import BTlogo from "@views/svgImg/BTlogo";
import C_Image from "@views/Layout/CircularImage";
import "@style/SideBar.css";
import Br from "./Br";
import IconBar from "./IconBar";
import IconBarOpen from "./IconBarOpen";
import {userState, sideState} from "@data/user/state";
import {useRecoilState, useRecoilValue} from "recoil";

const SideBar = () => {
  const navigate = useNavigate();
  const loginUser: any = useRecoilValue(userState);
  const [sidebarOpen, setSidebarOpen]: any = useRecoilState(sideState);
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
          <div className="sidebar_top">
            <div onClick={() => navigate("/")}>
              <Link to="/">
                <BTlogo />
              </Link>
            </div>
            <Br />
            <Br />
            <C_Image src={defaultImg /* 원래 들어가야하는 거 -> loginUser.meta.profilepictureurl */} alt="Profile image" size="130" />
          </div>
          <Br />
          <Br />
          {sidebarOpen && (
            <div style={{display: "flex", justifyContent: "center"}}>
              <IconBarOpen />
            </div>
          )}
        </div>
        <div className="sidebar_separator"></div>
        {!sidebarOpen && <IconBar />}
      </div>

      <Outlet />
    </div>
  );
};

export default SideBar;
