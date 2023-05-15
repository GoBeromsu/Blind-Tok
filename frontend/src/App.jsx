import React, {useEffect, useState, Component} from "react";
import "./components/style/App.css";
import SideBar from "./components/views/Layout/SideBar";
import UserProfile from "./components/views/User/UserProfile";
import MainComponent from "./components/views/MainPage/MainComponent";
import FriendList from "./components/views/Friend/FriendList";
import ChatList from "./components/views/Chat/ChatList";
import ChatRoom from "./components/views/Chat/ChatRoom";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import getUser from "./data/User/query";

const App = () => {
  const user_id = "choichoichoi";
  const [user, setUser] = useState(getUser(user_id));

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(windowWidth <= 768 ? 50 : 200);
  const [contentWidth, setContentWidth] = useState(windowWidth - sidebarWidth);

  useEffect(() => {
    setUser(getUser(user_id));
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setSidebarWidth(windowWidth <= 768 ? 50 : 332);
    setContentWidth(windowWidth - sidebarWidth);
  }, [windowWidth, sidebarWidth]);

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<SideBar user={user} />}>
            <Route index element={<MainComponent />} />
            <Route path="/friend" element={<FriendList user={user} />} />
            <Route path="/chat" element={<ChatList user={user} />} />
            <Route path="/User" element={<UserProfile />} />
          </Route>

          <Route path="/friend_s" element={<SideBar user={user} />}>
            {/*<Route path=":friendid" element={<MainComponent/>}/>*/}
          </Route>

          <Route path="/ChatRoom" element={<SideBar user={user} />}>
            <Route path=":room_id" element={<ChatRoom user={user} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
