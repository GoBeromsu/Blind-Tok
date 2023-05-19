import React, {useEffect, useState, Component} from "react";
//import {connect} from "react-redux";
import "../style/App.css";
import SideBar from "./SideBar";
import UserProfile from "./UserProfile";
import MainComponent from './MainComponent';
import FriendList from './FriendList';
//import FriendPage from './FriendPage';
import ChatList from './Chat/ChatList';
import ChatRoom from "./ChatRoom";
import getUser from '../../data/user_data';
//import RegisterPage from "./RegisterPage";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import {getSocket, createSocket} from '../socket/client';

const App = () => {
  // socket.io
  var socket;
  var init = false;
  useEffect(() => {
    if(init == false){
      createSocket();
      socket = getSocket();
      socket.emit("data_init", user_id);
      init = true;
    }
  },[]);
  
  const user_id = "choochoochoo";
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
            <Route path="/" element={<SideBar user={user}/>}>
                <Route index element={<MainComponent />} />
                <Route path="/friend" element={<FriendList user={user}/>} />
		            <Route path="/chat" element={<ChatList user={user}/>} />
                <Route path="/User" element={<UserProfile/>}/>
            </Route>
        
            <Route path="/friend_s" element={<SideBar user={user} />}>
                {/*<Route path=":friendid" element={<MainComponent/>}/>*/}
            </Route>
 
            <Route path="/ChatRoom" element={<SideBar user={user}/>}>
                <Route path=":room_id" element={<ChatRoom user={user}/>}/>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      
    </div>
  );
};



export default App;
