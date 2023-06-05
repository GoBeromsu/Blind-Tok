import React, {useState, useEffect} from "react";
import Button from "../Layout/Button";
import C_Image from "../Layout/CircularImage";
import "../../style/SideBar.css";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {leaveRoom, addUser, joinVideoChat} from "@data/chat/ChattingController";
import {useRecoilValue} from "recoil";
import {userState} from "@data/user/state";
import Modal from "react-modal";
import {getFriendListQuery} from "@data/Friend/state";
import Box from "@mui/material/Box";

const ChatBar: React.FC = () => {
  const {roomid} = useParams();
  const navigate = useNavigate();
  const loginUser: any = useRecoilValue(userState);
  const {isLoading, isError, data, error, refetch} = getFriendListQuery(loginUser?.userid);

  // 유저의 친구 목록을 불러와 저장할 변수
  const [friendList, setFriendList] = useState<any>([]);
  // 방에 유저를 초대할 때 그 유저의 리스트를 저장할 변수
  const [friendToInvite, setFriendToInvite]: any = useState([]);
  // 검색을 위한 변수
  const [searchInput, setSearchInput] = useState("");
  // 모달의 on,off를 저장할 상태 변수
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleClick = () => {};
  // 방 나갈 때 실행되는 이벤트 함수
  const handleLeaveRoom = () => {
    if (Number(roomid)) {
      leaveRoom(Number(roomid), loginUser?.userid);
      navigate("/chat");
    } else "leaveRoom error : roomid undefined";
  };
  // 친구 목록을 불러와 friendList에 저장하는 이벤트 함수
  // 이미 속해있는 친구를 제외해줘야됨. 이를 추후 추가 예정
  const handleGetFriendList = (friendList: any) => {
    const formattedFriends = friendList?.map((data: any) => ({userid: data.friendid})) || [];
    console.log(formattedFriends);
    setFriendList(formattedFriends);
  };
  // 초대할 목록에 인원을 추가하는 함수
  // 초대할 목록에 이미 있는지 확인하고 없으면 추가
  const handleAddToInviteList = (friend: any) => {
    if (!friendToInvite.find((friend: any) => friend.userid === friend.userid)) {
      setFriendToInvite([friend, ...friendToInvite]);
    }
  };
  // 초대할 목록에서 인원을 뺄 함수
  const handleRemoveFromInviteList = (friend_n: any) => {
    setFriendToInvite(friendToInvite.filter((friend: any) => friend.userid !== friend_n.userid));
  };
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

  const SearchChange = (event: any) => {
    setSearchInput(event.target.value);
  };
  const handleVideoChat = () => {
    joinVideoChat(Number(roomid), loginUser?.userid);
  };

  //.filter((friend: any) => friend.userid.toLowerCase().includes(search_f.toLowerCase()));
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box style={{display: "flex"}}>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setFriendToInvite([]);
        }}
        style={M_style}>
        <Box className="modal" style={{display: "flex", overflow: "auto", gap: "30px"}}>
          {friendToInvite.map((friend: any, index: number) => (
            <Box
              key={index}
              style={{height: "50px"}}
              onClick={() => {
                handleRemoveFromInviteList(friend);
              }}>
              {friend.userid}
            </Box>
          ))}
        </Box>
        <input type="text" placeholder="Search" value={searchInput} onChange={SearchChange} style={{position: "sticky", top: "0px"}} />
        <Box className="f_item">
          {friendList.map((friend: any, index: number) => (
            <Box
              key={index}
              style={{width: `30px`, height: "50px"}}
              onClick={() => {
                handleAddToInviteList(friend);
              }}>
              {friend.userid}
            </Box>
          ))}
        </Box>
        <button
          onClick={() => {
            addUser(Number(roomid), friendToInvite);
            setModalIsOpen(false);
            setFriendToInvite([]);
          }}
          style={{width: "50px", height: "50px"}}>
          확인
        </button>
      </Modal>
      <Box className={`sidebar${sidebarOpen ? "" : " closed"}`}>
        <Box className="test">
          <Box className="sidebar_main">
            <Box className="item">
              <Link to="/friend">
                <Button onClick={handleClick} label="친구 목록" />
              </Link>
            </Box>
            <Box className="item">
              <Button onClick={handleClick} label="검색" />
            </Box>
            <Box className="item">
              <Button
                onClick={() => {
                  setModalIsOpen(true);
                  handleGetFriendList(data);
                }}
                label="추가"
              />
            </Box>
            <Box className="item">
              <Button onClick={handleClick} label="알림" />
            </Box>{" "}
            <Box className="item">
              <Link to="/video">
                <Button onClick={handleVideoChat} label="화상 채팅" />
              </Link>
            </Box>
            <Box className="item">
              <Link to="/User">
                <Button onClick={handleClick} label="설정" />
              </Link>
            </Box>
            <Box className="item">
              <Button onClick={handleLeaveRoom} label="방 나가기" />
            </Box>
          </Box>
        </Box>
      </Box>

      <Outlet />
    </Box>
  );
};

export default ChatBar;
