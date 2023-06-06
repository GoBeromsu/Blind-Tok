import {Box, Button, IconButton} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import AudioUploadPage, {handleFileUpload} from "@views/User/AudioUpload";
import {getFileMetaList} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {getUserInfo} from "@data/user/axios";
import {addFriend, editFriendStatus, acceptFriend} from "@data/Friend/axios";

import "@style/UserPage.css";

Modal.setAppElement("#root");

interface Props {
  own: any;
}

const UserModal: React.FC<Props> = ({own}) => {
  let user: any = useRecoilState(userState)[0];
  const [relationid, setRelationid] = useState<any>();
  const [audioList, setAudioList] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [owner, setOwner] = useState<any>();

  // 상태를 알려주는 변수
  // 1 1 : 친구, 0 0 : 아무요청도 없음, 1 0 : 저쪽에서 요청, 0 1 : 유저가 요청
  const [flag1, setFlag1] = useState<any>(false);
  const [flag2, setFlag2] = useState<any>(false);

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
      let index = user?.friends?.find((user: any) => user.userid === ownerData.userid);
      console.log(user);
      console.log(ownerData);
      // 친구인지 구별
      if (index && index != -1) {
        // 일단 저쪽에서 유저에게 보낸 정황이 있음
        setFlag1(true);
        setRelationid(user?.friends[index]?.relationid);
      } else {
        setFlag1(false);
      }
      index = user?.friends?.find((user: any) => user.userid === ownerData.userid);
      if (index && index != -1) {
        // 유저에서 저쪽으로 보낸 정황이 있음
        setFlag2(true);
      } else {
        setFlag2(false);
      }
    } catch (error) {
      console.error("Failed to get owner information:", error);
      throw error;
    }
  };

  // 친구 추가 버튼 클릭 시 실행될 동작을 정의.
  const handleAddFriend = () => {
    console.log(`${user?.userid} -> ${own}`);
    addFriend(user?.userid, own);
  };
  const handleAcceptFriend = () => {
    console.log(`${user?.userid} -> ${own}`);
    editFriendStatus(relationid, "normal");
    acceptFriend(user?.userid, own);
    setFlag2(true);
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
            <IconButton color="primary" onClick={!flag1 && !flag2 ? handleAddFriend : flag1 && !flag2 ? handleAcceptFriend : () => {}}>
              {!flag1 && !flag2 && "친추"}
              {flag1 && !flag2 && "수락"}
              {!flag1 && flag2 && "요청보냄"}
              {flag1 && flag2 && "친구"}
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
