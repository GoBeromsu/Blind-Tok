import React, {useState, useEffect} from "react";
import Button from "../Layout/Button";
import C_Image from "../Layout/CircularImage";
import "../../style/SideBar.css";
import MessageBox from "../MainPage/MessageBox";
//import BTlogo from "/image/BTlogo";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {leaveRoom} from "../../../socket";
import {subChat_list} from "@data/Chat/chat_list";

const ChatBar: React.FC = () => {
  const {room_id} = useParams();
  const navigate = useNavigate();
  const handleClick = () => {};
  const leave = () => {
    if (room_id) {
      leaveRoom(room_id);
      navigate("/chat");
    } else "leaveRoom error : room_id undefined";
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

  //const image = require("");

  return (
    <div style={{display: "flex"}}>
      <div className={`sidebar${sidebarOpen ? "" : " closed"}`}>
        <div className="test">
          <div className="sidebar_main">
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
                <Button onClick={handleClick} label="추가" />
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
              <Button onClick={leave} label="방 나가기" />
              <br />
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default ChatBar;
