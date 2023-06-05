import {Box, Button, IconButton} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import AudioUploadPage, {handleFileUpload} from "@views/User/AudioUpload";
import {getFileMetaList} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {getUserInfo} from "@data/user/axios";
import "@style/UserPage.css";

Modal.setAppElement("#root");

interface Props {
  own: any;
}

const UserModal: React.FC<Props> = ({own}) => {
  const [audioList, setAudioList] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [owner, setOwner] = useState<any>();

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
      position: "fixed",
      background: "#ffffff",
      overflow: "auto",
      inset: "100px 700px",
      WebkitOverflowScrolling: "touch",
      borderRadius: "14px",
      outline: "none",
      zIndex: 10,
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: "10px 30px",
      height: "70vh",
    },
  };

  useEffect(() => {
    if (owner) {
      fetchAudioList();
    }
  }, [owner]);

  const fetchAudioList = async () => {
    if (owner) {
      try {
        const audioFiles = await getFileMetaList(owner.userid);
        setAudioList(audioFiles.data.reverse());
      } catch (error) {
        console.error("Failed to fetch audio files:", error);
      }
    }
  };

  useEffect(() => {
    if (own) {
      getOwnerData(own);
    }
  }, [own]);

  const getOwnerData = async (own: any) => {
    try {
      const getData = await getUserInfo(own);
      const ownerData = getData.data;
      setOwner(ownerData);
    } catch (error) {
      console.error("Failed to get owner information:", error);
      throw error;
    }
  };

  // 친구 추가 버튼 클릭 시 실행될 동작을 정의.
  const handleAddFriend = () => {
    console.log("친구 추가 버튼이 클릭되었습니다.");
  };

  return (
    <Box className="userAudioList">
      <Box className="user-info">
        <div className="container">
          <div className="profile-picture">
            {owner && owner.meta?.profilepictureurl ? (
              <img src={owner.meta.profilepictureurl} alt="Profile Picture" />
            ) : (
              <div className="empty-image"></div>
            )}
          </div>
          <div className="user-info">
            <h2>
              {owner?.name} ({owner?.nickname})
            </h2>
            <IconButton color="primary" onClick={handleAddFriend}>
              친추
              <AddIcon />
            </IconButton>
            <p>{owner?.meta?.profilemesage}</p>
            <p>친구 수: {owner?.friends?.length}</p>
            <p>게시물 수: {audioList?.length}</p>
          </div>
        </div>
      </Box>
      <h2>이 사람의 게시물</h2>
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

export default UserModal;
