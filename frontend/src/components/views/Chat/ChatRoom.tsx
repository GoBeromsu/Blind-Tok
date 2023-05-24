import React, {useState, useEffect} from "react";
import {useParams, useLocation, useSearchParams, Link} from "react-router-dom";
import {getFriendlist} from "@data/Friend/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {getChatData} from "@data/chat/chat_data";
import {sendMessage} from "../../../socket";
import {Box, Button, Input} from "@mui/material";

export let updateChat: any = () => {};

interface User {
  user_id: any;
  nickname: any;
}

const ChatRoom: React.FC = () => {
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const myCSS = {
    display: "flex",
    alignItems: "flex-end",
    borderStyle: "solid",
    borderWidth: "0px",
    margin: "5px",
    maxWidth: "800px",
    backgroundColor: "rgba(30, 150, 100, 0.1)",
  };
  const youCSS = {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "row-reverse",
    borderStyle: "solid",
    borderWidth: "0px",
    margin: "5px",
    maxWidth: "800px",
    backgroundColor: "rgba(30, 150, 100, 0.1)",
  };
  const nameCSS = {
    borderStyle: "solid",
    borderWidth: "0px",
    margin: "5px",
    fontSize: "20px",
    fontWeight: "700",
  };
  const dataCSS = {
    borderStyle: "solid",
    borderWidth: "0px",
    margin: "5px",
    maxWidth: "400px",
    backgroundColor: "rgba(30, 150, 100, 0.1)",
  };

  const params: any = useParams();
  const chatRoom: any = getChatData(params.room_id);
  const location: any = useLocation();

  const [searchParams, setSearchParams]: [any, (params: any) => void] = useSearchParams();
  const detail: any = searchParams.get("detail");

  const [chat_data, setChat_data]: [any, (data: any) => void] = useState(chatRoom.data);
  const [string, setString]: [string, (str: string) => void] = useState("");
  let check_n = "";

  updateChat = (data: any) => {
    //console.log(data);
    let {room_id, ...rest} = data;
    if (room_id === chatRoom.room_id) {
      setChat_data([...chat_data, rest]);
    }
  };

  const click = (e: any) => {
    let today = new Date();
    let hours: any = today.getHours(); // 시
    hours = hours < 10 ? "0" + hours : hours; // 자릿수 맞추기
    let minutes: any = today.getMinutes(); // 분
    minutes = minutes < 10 ? "0" + minutes : minutes; // 자릿수 맞추기
    const data = {
      room_id: chatRoom.room_id,
      user_id: loginUser.userid,
      user_nickname: loginUser.nickname,
      time: `${hours} : ${minutes}`,
      data_s: string,
    };
    sendMessage(data);
    setString("");
  };

  const textChange = (e: any) => {
    setString(e.target.value);
  };

  const check_name = (str: any) => {
    if (str === check_n) return 1;
    else {
      check_n = str;
      return 0;
    }
  };

  return (
    <Box>
      <Box style={{width: `100%`, height: "100%"}}>
        <Box style={{width: `100%`, height: "90%"}}>
          {chat_data.map((p: any, index: number) => (
            <Box key={index} className="text" style={{width: "800px"}}>
              <Box style={loginUser?.userid === p?.user_id ? {...nameCSS, textAlign: "right"} : {...nameCSS, textAlign: "left"}}>
                {check_name(p.user_nickname) === 1 ? "" : p.user_nickname}
              </Box>
              <Box style={loginUser?.userid === p?.user_id ? myCSS : youCSS}>
                <Box style={dataCSS}>{p.data_s}</Box>
                <Box style={{fontSize: "10px"}}>{p.time}</Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box>
          <Input type="text" placeholder="" value={string} onChange={textChange} style={{width: `93%`, height: "9%"}} />
          <Button onClick={click}>확인</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatRoom;
