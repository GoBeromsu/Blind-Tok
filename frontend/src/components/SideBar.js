import React, {useState, useEffect} from "react";
import Button from "./Button";
import C_Image from "./CircularImage";
import image from "../image/l.png";
import "./style/SideBar.css";
import Br from "./Br";
import MessageBox from "./MessageBox";
import BTlogo from "./BTlogo";

const SideBar = () => {
  const handleClick = () => {
    alert("Button clicked!");
  };
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
    <div className={`sidebar${sidebarOpen ? "" : " closed"}`}>
      <div className="test">
        <div className="sidebar_main">
          <p>
            <BTlogo style={{display: "flex", alignItems: "center"}} />
            <Br />
          </p>
          <C_Image src={image} alt="프로필 이미지" size="130" />
          <br />

          <MessageBox />
          <Br />
          <div className="item">
            <Button onClick={handleClick} label="친구 목록" />
            <br />
          </div>
          <br />
          <br />
          <div className="item">
            <Button onClick={handleClick} label="검색" />
          </div>
          <div className="item">
            <Button onClick={handleClick} label="채팅" />
            <br />
          </div>
          <div className="item">
            <Button onClick={handleClick} label="알림" />
            <br />
          </div>
          <div className="item">
            <Button onClick={handleClick} label="설정" />
            <br />
          </div>
          <div className="item">
            <Button onClick={handleClick} label="로그아웃" />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
