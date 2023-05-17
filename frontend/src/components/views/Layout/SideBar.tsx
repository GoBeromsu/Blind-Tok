﻿import React, {useState, useEffect} from "react";
import Button from "./Button";
<<<<<<< HEAD
import C_Image from "@views/Layout/CircularImage";
import image from "@image/123.png";
import "../../style/SideBar.css";
import Br from "./Br";
import MessageBox from "../MainPage/MessageBox.js";
import BTlogo from "@image/BTlogo";
=======
import C_Image from "./CircularImage";
import "../../style/SideBar.css";
import MessageBox from "../MainPage/MessageBox";
import BTlogo from "/image/BTlogo";
>>>>>>> 7e6c64a86419495abba828594a8ea8e4a6d7baa8
import {Link, Outlet, useNavigate} from "react-router-dom";

interface SideBarProps {
  user: any; // 사용자 타입에 맞게 수정해야 함
}

const SideBar: React.FC<SideBarProps> = ({user}) => {
  const handleClick = () => {};
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const image = require("/image/l.png");

  return (
    <div style={{display: "flex"}}>
      <div className={`sidebar${sidebarOpen ? "" : " closed"}`}>
        <div className="test">
          <div className="sidebar_main">
            <img src={BTlogo} style={{display: "flex", alignItems: "center"}} alt="BT 로고" />
            <C_Image src={image} alt="프로필 이미지" size="130" />
            <br />

            <MessageBox user={user} />
            <div className="item">
              <Link to="/friend">
                <Button onClick={handleClick} label="친구 목록" />
              </Link>
              <br />
            </div>
            <br />
            <br />
            <div className="item">
              <Button onClick={handleClick} label="검색" />
            </div>
            <div className="item">
              <Link to="/chat">
                <Button onClick={handleClick} label="채팅" />
              </Link>
              <br />
            </div>
            <div className="item">
              <Button onClick={handleClick} label="알림" />
              <br />
            </div>
            <div className="item">
              <Link to="/User">
                <Button onClick={handleClick} label="설정" />
              </Link>
              <br />
            </div>
            <div className="item">
              <Button onClick={handleClick} label="로그아웃" />
              <br />
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default SideBar;
