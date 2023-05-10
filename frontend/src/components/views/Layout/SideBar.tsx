import React, {useState, useEffect} from "react";
import Button from "./Button";
import C_Image from "./CircularImage";
import image from "../../../image/l.png";
import "../../style/SideBar.css";
import Br from "./Br";
import MessageBox from "../MainPage/MessageBox.js";
import BTlogo from "../../../image/BTlogo";
import {Link, Outlet, useNavigate} from "react-router-dom";

const SideBar = ({user}) => {
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
  return (
    <div style={{display: "flex"}}>
      <div className={`sidebar${sidebarOpen ? "" : " closed"}`}>
        <div className="test">
          <div className="sidebar_main">
            <BTlogo style={{display: "flex", alignItems: "center"}} />
            <Br />

            <C_Image src={image} alt="프로필 이미지" size="130" />
            <br />

            <MessageBox user={user} />
            <Br />
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
