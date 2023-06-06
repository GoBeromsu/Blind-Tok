import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@data/user/state";
import {Box} from "@material-ui/core";
import React, {useEffect, useRef, useState} from "react";
import Loading from "@loading/Loading";
import {getFriendListQuery} from "@data/Friend/state";
import {Button, List, ListItem, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import ChatUserDialog from "@views/Chat/ChatUserDialog";
import {createRoom} from "@data/chat/ChattingController";
import {chatListState, ChatRoom} from "@data/chat/state";
import {getRooms} from "@data/chat/chat_list";
import {useSocket} from "@data/chat/useSocket";
import {sendMessage} from "@data/chat";

// export let setList: any = () => {};

const NewChatList = () => {
  const loginUser: any = useRecoilValue(userState);
  if (!loginUser) {
    return <Loading />;
  }
  const {isLoading, isError, data, error} = getFriendListQuery(loginUser?.userid);
  const [invitedFriend, setInvitedFriend] = useState<any>(0);
  const [oepn, setOepn] = useState(false);
  const [roomList, setRoomList] = useRecoilState<any>(chatListState);

  const [windowWidth, setWindowWidth] = useState<any>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<any>(window.innerHeight);
  const [W, setW] = useState<any>(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  };
  const socket = useSocket();

  const handleInvited = (newFriend: any) => {
    console.log("새로운 user가 선택 되었습니다", newFriend);
    setInvitedFriend(newFriend);

    createRoom(loginUser, [newFriend]);
    getRooms();
  };
  const onChangeUser = (e: any) => {
    setOepn(true);
  };
  useEffect(() => {
    sendMessage(loginUser?.userid, "dataInit");
    getRooms();
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("message", (message: any) => {
        let {id, data} = message;
        switch (id) {
          case "createRoom":
            console.log("새로운 방이 생성되었습니다.", data);
            const {roomid, roomname, maxnum, userlist} = data;
            // setRoomList([data...roomList]);
            setRoomList([{roomid, roomname, maxnum, userlist}, ...roomList]);
            break;
          case "getRooms":
            console.log("Get rooms", data);
            setRoomList(data);
          default:
            break;
        }
      });
    }
    return () => {
      socket.off();
    };
  }, [socket, open]);

  // setList = (list: any) => {
  //   setRoomList(list);
  // };

  return (
    <Box className="f_list" style={{width: `${windowWidth - 300}px`, paddingLeft: "340px"}}>
      <h1>Chatting Room</h1>
      <Box className="Search Input">
        <TextField size="small" fullWidth />
      </Box>
      <Box>
        <Box>
          <Button sx={{background: "#3d99fc"}} variant="contained" onClick={onChangeUser}>
            새로운 방 생성
          </Button>
        </Box>
        <ChatUserDialog open={oepn} setOpen={setOepn} users={data} selectedUser={invitedFriend} handleUser={handleInvited} />
      </Box>
      <Box>
        <Box>방 리스트가 들어갈 공간</Box>
        <List sx={{padding: 0}}>
          {roomList?.map((room: any) => {
            return (
              <Box key={room?.roomid}>
                <Link to={`/ChatRoom/${room?.roomid}`}>
                  <ListItem sx={{backgroundColor: "#bbb"}}>{room?.roomname}</ListItem>
                </Link>
              </Box>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default NewChatList;
