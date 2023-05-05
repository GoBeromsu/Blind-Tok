import React, {useEffect, useState, Component} from "react";
//import {connect} from "react-redux";
import "../style/App.css";
import SideBar from "./SideBar";
import UserProfile from "./UserProfile";
import MainComponent from './MainComponent';
import FriendList from './FriendList';
import FriendPage from './FriendPage';
import ChatList from './ChatList';
//import RegisterPage from "./RegisterPage";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(windowWidth <= 768 ? 50 : 200);
  const [contentWidth, setContentWidth] = useState(windowWidth - sidebarWidth);

  useEffect(() => {
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
            <Route path="/" element={<SideBar />}>
                <Route index element={<MainComponent />} />
                <Route path="/friend" element={<FriendList />} />
		            <Route path="/chat" element={<ChatList />} />
            </Route>
        
            <Route path="/friend_s" element={<SideBar />}>
                <Route path=":friendid" element={<MainComponent/>}/>
            </Route>
 
            <Route path="/ChatRoom" element={<SideBar />}>
                {/*<Route path=":friendid" element={</>}/>*/}
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      
    </div>
  );
};



export default App;
