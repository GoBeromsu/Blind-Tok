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
  const [user, setUser]: any = useState<any>();
  const [audioList, setAudioList] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen]: any = useRecoilState(sideState);

  useEffect(() => {
    if (userInfo) setUser(userInfo);
    if (list) setAudioList(list);
  });

  return (
    <Box className="userAudioList" style={{paddingLeft: "60px"}}>
      <Box className="user-info" style={{}}>
        <div className="container">
          <div className="profile-picture">
            {user?.meta?.profilePictureUrl ? <img src={user?.meta?.profilePictureUrl} alt="Profile Picture" /> : <div className="empty-image"></div>}
          </div>
          <div className="user-info">
            <h2>
              {user?.name} ( {user?.nickname} )
            </h2>
            <p>소개:{user?.meta?.profileMesage}</p>
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
