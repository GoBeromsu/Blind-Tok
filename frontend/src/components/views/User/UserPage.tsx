import {dividerClasses} from "@mui/material";
import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import {Box, Button, Input} from "@mui/material";
import AudioUploadPage, {handleFileUpload} from "@views/User/AudioUpload";
import {getFileMetaList, deleteAudioFile} from "@data/upload/axios";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState, sideState} from "@data/user/state";
import "@style/UserPage.css";

export let fetchAudioList: any = () => {};

Modal.setAppElement("#root");
const UserPage = () => {
  const [windowWidth, setWindowWidth] = useState<any>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<any>(window.innerHeight);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [audioList, setAudioList] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const sidebarOpen: any = useRecoilValue(sideState);
  const M_style: any = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.45)",
      zIndex: 10,
    },
    content: {
      display: "flex",
      background: "#ffffff",
      overflow: "auto",
      inset: "100px 700px",
      WebkitOverflowScrolling: "touch",
      borderRadius: "14px",
      outline: "none",
      zIndex: 10,
      flexDirection: "column",
      flexWrap: "nowrap",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: "10px 30px",
      height: "70vh",
    },
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    if (loginUser) {
      fetchAudioList();
    }
  }, [loginUser]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDeleteAudio = async (audioFile: any) => {
    try {
      if (loginUser) {
        await deleteAudioFile(audioFile, loginUser);
        fetchAudioList();
      }
    } catch (error) {
      console.error("Failed to delete audio file:", error);
    }
  };

  fetchAudioList = async () => {
    console.log("zzzz");
    if (loginUser) {
      try {
        const audioFiles = await getFileMetaList(loginUser.userid);
        setAudioList(audioFiles.data.reverse());
      } catch (error) {
        console.error("Failed to fetch audio files:", error);
      }
    }
  };

  return (
    <Box
      className="userAudioList"
      style={sidebarOpen ? {width: `${windowWidth - 300}px`, paddingLeft: "380px"} : {width: `${windowWidth - 300}px`, paddingLeft: "80px"}}>
      <Box className="user-info" style={{width: `${windowWidth - 300}px`}}>
        <div className="container">
          <div className="profile-picture">
            {loginUser?.meta?.profilepictureurl ? (
              <img src={loginUser?.meta?.profilepictureurl} alt="Profile Picture" />
            ) : (
              <div className="empty-image"></div>
            )}
          </div>
          <div className="user-info">
            <h2>
              {loginUser?.name} ( {loginUser?.nickname} )
            </h2>
            <p>{loginUser?.meta.profilemesage}</p>
            <p>친구: {loginUser?.friends.length}</p>
            <p>게시물 수: {audioList?.length}</p>
          </div>
        </div>
      </Box>
      <h2>
        My audio list
        <Button
          onClick={() => {
            setModalIsOpen(true);
          }}
          style={{width: "50px", height: "50px"}}>
          추가
        </Button>
      </h2>
      {audioList.length > 0 ? (
        <ul>
          {audioList.map((audioFile, index) => (
            <li key={index}>
              <div>
                <h3>{audioFile.filename}</h3>
                <p>Comment: {audioFile.comment}</p>
                {audioFile.image && <img src={audioFile.image} alt="Audio Image" />}
                <button onClick={() => handleDeleteAudio(audioFile)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No audio files found.</p>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        style={M_style}>
        <AudioUploadPage />
        <Button
          onClick={() => {
            setModalIsOpen(false);
            handleFileUpload();
          }}
          style={{width: "50px", height: "50px", alignSelf: "flex-end"}}>
          확인
        </Button>
      </Modal>
    </Box>
  );
};

export default UserPage;
