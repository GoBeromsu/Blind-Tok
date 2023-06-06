import React, {useEffect, useState, Component, Suspense} from "react";
import "@style/App.css";
import SideBar from "@views/Layout/SideBar";
// import UserProfile from "./components/views/User/UserProfile";
// import MainComponent from "./components/views/MainPage/MainComponent";
// import FriendList from "./components/views/Friend/FriendList";
//import ChatList from "./components/views/Chat/ChatList";

import {setLocalStorageName} from "@data/chat/chat_data";

import {BrowserRouter as Router, Route, Routes, Navigate, Outlet} from "react-router-dom";
import {getAuthUserQuery, getUserInfoQuery} from "@data/user/query";
import Loading from "react-loading";

import Login from "@views/Login/Login";
import Auth from "@hoc/Auth";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";
import MainComponent from "@views/MainPage/MainComponent";
import FriendList from "@views/Friend/FriendList";
import FriendPage from "@views/Friend/FriendPage";
import ChatRoom from "@views/Chat/ChatRoom";
import ChatList from "@views/Chat/ChatList";
import ChatBar from "@views/Chat/ChatBar";
import UserProfile from "@views/User/UserProfile";
import UserPage from "@views/User/UserPage";
import Notification from "@views/Friend/Notification";

import AudioUploadPage from "@views/MainPage/AudioUpload";
import VideoChat from "@views/Chat/VideoChat";

import {Style} from "@material-ui/icons";
import {sendMessage} from "@data/chat";
import newChatList from "@views/Chat/newChatList";

export default function App() {
  return (
    //App 최초 로딩 fallback
    <Suspense fallback={<Loading />}>
      <AppRoutes />
    </Suspense>
  );
}

function AppRoutes() {
  const {isLoading, isError, data, error} = getAuthUserQuery();
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(windowWidth <= 768 ? 50 : 200);
  const [contentWidth, setContentWidth] = useState(windowWidth - sidebarWidth);

  useEffect(() => {
    if (loginUser == null && data != null) {
      setLoginUser(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  const user = loginUser || data;
  return (
    <div className="container">
      <Routes>
        // Auth에 뭐 줘야 할지 헷갈리면 걍 True로 두셈 ㅇㅇ 아니면 주석 처리하거나 // Auth 페이지에 유저를 주는 이유는 로그인이 되어 있지 않으면
        로그인 페이지로 이동하기 위함
        <Route path="/" element={Auth(SideBar, true, user)}>
          <Route index element={Auth(MainComponent, true, user)}></Route>
          <Route path="/friend" element={Auth(FriendList, true, user)}>
            <Route path=":friendid" element={Auth(FriendPage, true, user)} />
          </Route>
          <Route path="/chat" element={Auth(newChatList, true, user)}></Route>
          <Route path="/User" element={Auth(UserPage, true, user)}></Route>
          <Route path="/upload" element={Auth(AudioUploadPage, true, user)}></Route>
          <Route path="/notification" element={Auth(Notification, true, user)}></Route>
        </Route>
        // Auth 페이지에 true를 주는 이유는 로그인이 되어있어야만 접근 가능 하도록 하기 위함
        <Route path="/login" element={Auth(Login, false)}></Route>
        //그 외에는 그냥 접근 해도 되는 것들임 ㅇㅇ
        <Route path="/video" element={Auth(VideoChat, false)}></Route>
        {/**/}
        {/*  <Route index element={<MainComponent />} />*/}
        {/*  <Route path="/friend" element={<FriendList user={user} />} />*/}
        {/*  <Route path="/chat" element={<ChatList user={user} />} />*/}
        {/*<Route path="/User" element={<UserProfile />} />*/}
        {/*</Route>*/}
        {/*<Route path="/friend_s" element={<SideBar user={user} />}>*/}
        {/*  /!*<Route path=":friendid" element={<MainComponent/>}/>*!/*/}
        {/*</Route>*/}
        <Route path="/ChatRoom" element={Auth(ChatBar, true, user)}>
          <Route path=":roomid" element={Auth(ChatRoom, true, user)} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
