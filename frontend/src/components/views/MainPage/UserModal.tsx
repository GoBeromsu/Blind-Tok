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
  list: any;
}

const UserModal: React.FC<Props> = ({own, list}) => {
  let user: any = list;
  const loginUser: any = useRecoilState(userState);
  const [relationid, setRelationid] = useState<any>();
  const [audioList, setAudioList] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // 상태를 알려주는 변수
  // 1 1 : 친구, 0 0 : 아무요청도 없음, 1 0 : 저쪽에서 요청, 0 1 : 유저가 요청
  const [flag1, setFlag1] = useState<any>(false);
  const [flag2, setFlag2] = useState<any>(false);
  const blindImg = "/image/blindProfile.jpg";
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
      inset: "100px 100px",
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
    if (own) {
      fetchAudioList();
    }
  }, [own]);

  const fetchAudioList = async () => {
    if (own) {
      try {
        const audioFiles = await getFileMetaList(own.userid);
        setAudioList(audioFiles.data.reverse());
      } catch (error) {
        console.error("Failed to fetch audio files:", error);
      }
    }
  };

  useEffect(() => {
    if (own) {
      handdleFriend(own);
    }
  }, [own]);

  const handdleFriend = async (own: any) => {
    try {
      console.log(user);
      let index = user?.find((user: any) => user.userid === own.userid);
      // console.log("my name", user);
      // console.log(own);
      // 친구인지 구별
      if (index && index != -1) {
        // 일단 저쪽에서 유저에게 보낸 정황이 있음
        setFlag1(true);
        setRelationid(user?.friends[index]?.relationid);
      } else {
        setFlag1(false);
      }
      index = user?.find((user: any) => user.friendid === own.userid);
      if (index && index != -1) {
        // 유저에서 저쪽으로 보낸 정황이 있음

        console.log(flag1, flag2);
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
    console.log(`${loginUser?.userid} -> ${own.userid}`);
    addFriend(loginUser?.userid, own.userid);
  };
  const handleAcceptFriend = () => {
    console.log(`${loginUser?.userid} -> ${own.userid}`);
    editFriendStatus(relationid, "normal");
    acceptFriend(loginUser?.userid, own.userid);
    setFlag2(true);
  };
  // 친추 버튼 텍스트
  const text = !flag1 && !flag2 ? "친추" : flag1 && !flag2 ? "수락" : !flag1 && flag2 ? "요청보냄" : "친구";
  return (
    <Box className="userAudioList">
      <Box className="user-info">
        <div className="container">
          <div className="profile-picture">
            {/* own.meta?.profilepictureurl가 undefined 이라 익명 아이콘 나오는거 */}
            {(user?.friendid === own.userid || (flag1 && flag2)) && own && own.meta?.profilePictureUrl ? (
              <img src={own.meta.profilePictureUrl} alt="Profile Picture" />
            ) : (
              <img src={blindImg} />
            )}
          </div>
          <div className="user-info">
            {user?.friendid === own.userid || (flag1 && flag2) ? (
              <h2>{own && own.name && own.nickname ? `${own.name} (${own.nickname})` : "익명"}</h2>
            ) : (
              <h2>익명</h2>
            )}
            <IconButton color="primary" onClick={!flag1 && !flag2 ? handleAddFriend : flag1 && !flag2 ? handleAcceptFriend : () => {}}>
              {text}
            </IconButton>
            <p>{own?.meta?.profilemesage}</p>
            <p>친구 수: {own?.friends?.length}</p>
            <p>게시물 수: {audioList?.length}</p>
          </div>
        </div>
      </Box>
      <h2>이 사람의 게시물</h2>
      {flag1 === true && flag2 === true ? (
        audioList?.length > 0 ? (
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
        )
      ) : (
        <p></p>
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
