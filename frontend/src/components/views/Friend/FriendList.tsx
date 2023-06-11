import React, {useState, useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import {userState, sideState} from "@data/user/state";
import {useRecoilState} from "recoil";
import {Box, Input, Button} from "@mui/material";
import Modal from "react-modal";
import {getRelation} from "@data/Friend/axios";
import {getFriendListQuery, getFriends} from "@data/Friend/state";
import Loading from "@loading/Loading";
import FriendPage from "./FriendPage";
import {getUserInfo} from "@data/user/axios";
import {getFileMetaList} from "@data/upload/axios";

interface Friend {
  userid: string;
}

Modal.setAppElement("#root");

const FriendList = () => {
  const [sidebarOpen, setSidebarOpen]: any = useRecoilState(sideState);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [friendInfo, setFriendInfo]: any = useState();
  const [audioList, setAudioList] = useState<any[]>([]);
  if (!loginUser) {
    return <Loading />;
  }
  const {isLoading, isError, data, error} = getFriends(loginUser?.userid);

  const [friendList, setFriendList] = useState([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [W, setW] = useState<number>(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const friends = data.map((friend: any) => ({userid: friend.friendId, username: friend.friendName}));
      setFriendList(friends);
    }
  }, [data]);
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
      inset: "100px 300px",
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
    setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [search, setSearch] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const fetchUser = async (friendid: number) => {
    if (friendid) {
      try {
        const userinfo = await getUserInfo(Number(friendid)).then(data => {
          return data.data;
        });
        setFriendInfo(userinfo);
      } catch (error) {
        console.error("Failed to fetch audio files:", error);
      }
    }
  };

  const fetchAudioList = async (friendid: number) => {
    try {
      const audioFiles = await getFileMetaList(friendid);
      setAudioList(audioFiles.data.reverse());
    } catch (error) {
      console.error("Failed to fetch audio files:", error);
    }
  };

  return (
    <Box
      className="f_list"
      style={sidebarOpen ? {width: `${windowWidth - 300}px`, paddingLeft: "350px"} : {width: `${windowWidth - 300}px`, paddingLeft: "100px"}}>
      <h1>Friend List</h1>
      <Input type="text" placeholder="Search friends..." value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />
      <Box className="f_item">
        {friendList?.map((friend: any, index) => (
          <Box
            key={index}
            className="friend-item"
            style={{width: `${W}px`, height: "50px"}}
            onClick={() => {
              setModalIsOpen(true);
              fetchUser(friend.userid);
              fetchAudioList(friend.userid);
            }}>
            {friend?.username}
          </Box>
        ))}
      </Box>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        style={M_style}>
        <FriendPage userInfo={friendInfo} list={audioList} />
        <Button
          onClick={() => {
            setModalIsOpen(false);
          }}
          style={{width: "50px", height: "50px", alignSelf: "flex-end"}}>
          확인
        </Button>
      </Modal>
    </Box>
  );
};

export default FriendList;
