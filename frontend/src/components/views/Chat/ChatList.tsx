// 필요한 모듈들을 임포트합니다.
import React, {useState, useEffect, useMemo} from "react";
import {Link} from "react-router-dom";
import Modal from "react-modal";
import {getFriendListQuery} from "@data/Friend/state";
import "@style/ChatList.css";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {createRoom, init_list} from "@data/chat/ChattingController";
import Loading from "@loading/Loading";
import Error from "@views/Error/Error";
import {Box, Button, Input} from "@mui/material";

import {io, Socket} from "socket.io-client";
import {SOCKET_URL} from "../../../consonants";

Modal.setAppElement("#root");

// 외부에서 접근 가능한 함수를 선언합니다. 초기에는 아무것도 하지 않는 함수로 설정합니다.
export let setList: any = () => {};

const ChatList: React.FC = () => {
  const loginUser: any = useRecoilValue(userState);

  if (!loginUser) {
    return <Loading />;
  }

  const {isLoading, isError, data, error} = getFriendListQuery(loginUser?.userid);
  // 여러 상태를 선언합니다. 이들은 대화방, 친구목록, 창 크기 등을 관리합니다.
  // 방 생성에 있어 초대될 유저의 목록을 저장할 변수
  const [addFriendList, setAddFriendList]: any = useState([]);
  // 유저가 속한 방의 목록을 저장하는 변수
  // init_list를 통해 유저의 chat_list에 저장된 방 목록을 초기값으로 설정한다.
  const [roomList, setRoomList] = useState<any>(init_list());
  // 방 생성할 때 친구를 추가할 수 있게 유저의 친구목록을 저장하는 변수
  const [friendList, setFriendList] = useState<any>([]);
  const [windowWidth, setWindowWidth] = useState<any>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<any>(window.innerHeight);
  const [W, setW] = useState<any>(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  // 검색을 위한 변수
  const [search, setSearch] = useState("");
  const [search_f, setSearch_f] = useState("");
  // 모달의 on/off를 위한 변수
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // useEffect를 사용해 로그인 사용자가 변경될 때마다 친구 목록을 다시 불러옵니다.
  useEffect(() => {
    if (data) {
      let friendIdList = data.map((user: any) => ({userid: user.friendid}));
      setFriendList(friendIdList);
    }
  }, [loginUser, data]);

  // 에러가 발생했다면 에러 컴포넌트를 반환합니다.
  if (isError) {
    return <Error error={error}></Error>;
  }

  // 창 크기가 변경될 때마다 상태를 업데이트하는 함수입니다.
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  };

  // 채팅방 목록을 업데이트하는 함수입니다.
  setList = (list: any) => {
    setRoomList(list);
  };

  // 초대할 목록에 인원을 추가하는 함수
  // 초대 목록에 이미있는 인원이면 추가하지 않는다.
  const add_list = (friend_n: any) => {
    if (!addFriendList.find((friend: any) => friend.userid === friend_n.userid)) {
      setAddFriendList([friend_n, ...addFriendList]);
    }
  };
  // 초대할 목록에서 인원을 뺄 함수
  const sub_list = (friend_n: any) => {
    setAddFriendList(addFriendList.filter((friend: any) => friend.userid !== friend_n.userid));
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  // 검색을 위한 필터
  const filteredChatRoom = roomList.filter((chat: any) => {
    if (!chat.roomname) return;
    return chat.roomname.toLowerCase().includes(search.toLowerCase());
  });

  const SearchChange = (event: any) => {
    setSearch_f(event.target.value);
  };

  return (
    <Box className="f_list" style={{width: `${windowWidth - 300}px`, paddingLeft: "340px"}}>
      <h1>Chating Room</h1>
      <Input type="text" placeholder="Search" value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />
      <Button onClick={() => setModalIsOpen(true)}> 새로운 방 생성</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setAddFriendList([]);
        }}
        style={M_style}>
        <Box className="modal" style={{display: "flex", overflow: "auto", gap: "30px"}}>
          {addFriendList.map((friend: any, index: number) => (
            <Box key={index} style={{height: "50px"}} onClick={() => sub_list(friend)}>
              선택 된 친구의 id : {friend.userid}
            </Box>
          ))}
        </Box>
        <input type="text" placeholder="Search" value={search_f} onChange={SearchChange} style={{position: "sticky", top: "0px"}} />
        <Box className="f_item">
          {friendList.map((friend: any, index: number) => (
            <Box
              key={index}
              style={{width: `${W}px`, height: "50px"}}
              onClick={() => {
                add_list(friend);
              }}>
              친구의 id : {friend.userid}
            </Box>
          ))}
        </Box>
        <Button
          onClick={() => {
            createRoom(loginUser, addFriendList);
            setModalIsOpen(false);
            setAddFriendList([]);
          }}
          style={{width: "50px", height: "50px"}}>
          확인
        </Button>
      </Modal>
      <Box className="f_item">
        {filteredChatRoom.map((chat: any, index: number) => (
          <Box key={index}>
            <Link to={`/ChatRoom/${chat.roomid}`}>
              <Box className="friend-item" style={{width: `${W}px`, height: "50px"}}>
                {chat.roomname}
                <br />
                {chat.lastMessage}
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChatList;

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
    inset: "100px 100px 100px 400px",
    WebkitOverflowScrolling: "touch",
    borderRadius: "14px",
    outline: "none",
    zIndex: 10,
    flexDirection: "column",
    flexWrap: "nowrap",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
};
