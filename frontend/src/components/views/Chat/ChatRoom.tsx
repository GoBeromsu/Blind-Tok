import React, {useState, useEffect} from "react";
import {useParams, useLocation, useSearchParams, Link} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@data/user/state";
import {sendEnteredMessage} from "@data/chat/ChattingController";
import {Box, Button, Input} from "@mui/material";
import {getChatData} from "@data/chat/chat_data";
import {useSocket} from "@data/chat/useSocket";
import {sendMessage} from "@data/chat";
import {getRooms} from "@data/chat/chat_list";

const ChatRoom: React.FC = () => {
  const loginUser: any = useRecoilValue(userState);
  const {roomid}: any = useParams();
  const [searchParams, setSearchParams]: any = useSearchParams();
  const textspace: any = document.getElementById("textspace");
  const chatData: any = getChatData(Number(roomid)); //가존의 채팅방 데이터를 가져온다
  const [chatDataState, setChatDataState]: any = useState(chatData.data ? chatData.data : []);
  const [string, setString]: any = useState("");

  let check_n = "";

  const socket = useSocket();

  // updateChat = (data: any) => {
  //   console.log("updateChat : ", data);
  //   let {roomid, ...rest} = data;
  //   if (roomid == chatData.roomid) {
  //     setChatDataState([...chatDataState, rest]);
  //   }
  // };
  useEffect(() => {
    sendMessage(loginUser?.userid, "dataInit");
    // getRooms();
  }, []);
  useEffect(() => {
    socket.on("message", (message: any) => {
      let {id, data} = message;
      console.log("message : ", message);
      switch (id) {
        case "message":
          updateChat(data);
          break;
      }
    });
    return () => {
      socket.off();
    };
  }, [socket, chatDataState]);
  const handleSendMessage = () => {
    sendEnteredMessage(chatData.roomid, loginUser, string);
    setString(""); //입력 칸을 초기화 해준다
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
      <Box style={{width: `100%`, height: "100%", paddingLeft: "350px"}}>
        <Box style={{width: `100%`, height: "93vh", overflow: "scroll"}}>
          {chatDataState?.map((friend: any, index: number) => (
            <Box
              key={index}
              className="text"
              style={{width: "800px"}}
              onLoad={() => {
                textspace.scrollTop = textspace.scrollHeight;
              }}>
              <Box style={loginUser?.userid === friend?.userid ? {...nameCSS, textAlign: "right"} : {...nameCSS, textAlign: "left"}}>
                {check_name(friend.nickname) === 1 ? "" : friend.nickname}
              </Box>
              <Box style={loginUser?.userid === friend?.userid ? myCSS : youCSS}>
                <Box style={dataCSS}>{friend.data_s}</Box>
                <Box style={{fontSize: "10px"}}>{friend.time}</Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box>
          <Input type="text" placeholder="" value={string} onChange={textChange} style={{width: `90%`, height: "5vh"}} />
          <Button onClick={handleSendMessage}>확인</Button>
        </Box>
      </Box>
      인
    </Box>
  );
};

export default ChatRoom;
const myCSS = {
  display: "flex",
  alignItems: "flex-end",
  flexDirection: "row-reverse",
  borderStyle: "solid",
  borderWidth: "0px",
  margin: "5px",
  maxWidth: "800px",
  backgroundColor: "rgba(30, 150, 100, 0.1)",
};
const youCSS = {
  display: "flex",
  alignItems: "flex-end",
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
