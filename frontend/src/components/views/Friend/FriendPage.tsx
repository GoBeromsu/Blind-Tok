import {dividerClasses} from "@mui/material";
import React, {useState, useEffect} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {Box, Button, Input} from "@mui/material";
import {getFileMetaList} from "@data/upload/axios";
import "@style/UserPage.css";
import {sideState} from "@data/user/state";
import {useRecoilState} from "recoil";

const FriendPage = ({userInfo, list}: any) => {
  const [windowWidth, setWindowWidth] = useState<any>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<any>(window.innerHeight);
  const [user, setUser]: any = useState<any>();
  const [audioList, setAudioList] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen]: any = useRecoilState(sideState);
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    if (userInfo) setUser(userInfo);
    if (list) setAudioList(list);
  });

  return (
    <Box
      className="userAudioList"
      style={sidebarOpen ? {width: `${windowWidth - 300}px`, paddingLeft: "340px"} : {width: `${windowWidth - 300}px`, paddingLeft: "40px"}}>
      <Box className="user-info" style={{width: `${windowWidth - 300}px`}}>
        <div className="container">
          <div className="profile-picture">
            {user?.meta?.profilepictureurl ? <img src={user?.meta?.profilepictureurl} alt="Profile Picture" /> : <div className="empty-image"></div>}
          </div>
          <div className="user-info">
            <h2>
              {user?.name} ( {user?.nickname} )
            </h2>
            <p>{user?.meta?.profilemesage}</p>
            <p>친구: {user?.friends?.length}</p>
            <p>게시물 수: {audioList?.length}</p>
          </div>
        </div>
      </Box>
      <h2>My audio list</h2>
      {audioList.length > 0 ? (
        <ul>
          {audioList.map((audioFile, index) => (
            <li key={index}>
              <div>
                <h3>{audioFile.filename}</h3>
                <p>Comment: {audioFile.comment}</p>
                {audioFile.image && <img src={audioFile.image} alt="Audio Image" />}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No audio files found.</p>
      )}
    </Box>
  );
};

export default FriendPage;
