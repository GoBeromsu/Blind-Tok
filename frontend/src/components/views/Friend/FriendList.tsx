import React, {useState, useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import {userState, sideState} from "@data/user/state";
import {useRecoilState} from "recoil";
import {Box, Input, Button} from "@mui/material";
import Modal from "react-modal";

interface Friend {
  userid: string;
}

Modal.setAppElement("#root");

const FriendList = () => {
  const [sidebarOpen, setSidebarOpen]: any = useRecoilState(sideState);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [W, setW] = useState<number>(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
    if (loginUser) {
      let list = loginUser.friends?.filter((user: any) => user.status === "normal");
      console.log(list);
      let friendIdList = list?.map((user: any) => ({
        userid: user.friendid,
      }));
      setFriendList(friendIdList);
    }
  }, [loginUser]);

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

  const filteredFriends = friendList?.filter(friend => friend.userid?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box
      className="f_list"
      style={sidebarOpen ? {width: `${windowWidth - 300}px`, paddingLeft: "350px"} : {width: `${windowWidth - 300}px`, paddingLeft: "100px"}}>
      <h1>Friend List</h1>
      <Input type="text" placeholder="Search friends..." value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />
      <Box className="f_item">
        {filteredFriends?.map((friend: any, index) => (
          <Link to={`/friend/${friend.userid}`}>
            <Box
              key={index}
              className="friend-item"
              style={{width: `${W}px`, height: "50px"}}
              onClick={() => {
                setModalIsOpen(true);
              }}>
              {friend.nickname}
            </Box>
          </Link>
        ))}
      </Box>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        style={M_style}>
        <Outlet />
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
