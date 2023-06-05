import {useRecoilValue} from "recoil";
import {userState} from "@data/user/state";
import {Box} from "@material-ui/core";
import React, {useState} from "react";
import Loading from "@loading/Loading";
import {getFriendListQuery} from "@data/Friend/state";
import {Button, TextField} from "@mui/material";
import ChatUserDialog from "@data/chat/ChatUserDialog";

const NewChatList = () => {
  const loginUser: any = useRecoilValue(userState);
  if (!loginUser) {
    return <Loading />;
  }
  const {isLoading, isError, data, error} = getFriendListQuery(loginUser?.userid);

  const [windowWidth, setWindowWidth] = useState<any>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<any>(window.innerHeight);
  const [W, setW] = useState<any>(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  };

  const [invitedFriend, setInvitedFriend] = useState<any>(0);
  const [oepn, setOepn] = useState(false);
  const handleInvited = (newFriend: any) => {
    console.log("새로운 user가 선택 되었습니다", newFriend);
    setInvitedFriend(newFriend);
  };
  const onChangeUser = (e: any) => {
    setOepn(true);
  };

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
    </Box>
  );
};

export default NewChatList;
