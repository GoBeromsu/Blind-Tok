import React, {useState, useEffect} from "react";
import Button from "@views/Layout/Button";
import C_Image from "@views/Layout/CircularImage";
import "@style/SideBar.css";
import MessageBox from "../MainPage/MessageBox";
import BTlogo from "@views/svgImg/BTlogo";
import {Link, Outlet, useNavigate} from "react-router-dom";

const SideBar = () => {
  const handleClick = () => {};
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
      <div className={`sidebar${sidebarOpen ? "" : " closed"}`}>
        <div className="test">
          <div className="sidebar_main">
            <BTlogo />
            <br />
            <br />
            <C_Image src={defaultImg} alt="프로필 이미지" size="130" />
            <br />

            {/*<MessageBox user={user} />*/}
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
