import React, {useState, useEffect} from "react";
import {useParams, useLocation, useSearchParams, Link} from "react-router-dom";
import {getFriendlist} from "@data/Friend/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {init_ChattingData, Message} from "@utils/ChattingController";

export let updateChat: any = () => {};

interface User {
  userid: any;
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
  const chatRoom: any = init_ChattingData(params.roomid);
  const location: any = useLocation();

  const [searchParams, setSearchParams]: [any, (params: any) => void] = useSearchParams();
  const detail: any = searchParams.get("detail");

  const [chat_data, setChat_data]: [any, (data: any) => void] = useState(chatRoom.data);
  const [string, setString]: [string, (str: string) => void] = useState("");
  let check_n = "";

  updateChat = (data: any) => {
    console.log(data);
    let {roomid, ...rest} = data;
    if (roomid === chatRoom.roomid) {
      setChat_data([...chat_data, rest]);
    }
  };

  const click = () => {
    Message(chatRoom.roomid, loginUser, string);
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
            <div key={index} className="text" style={{width: "800px"}}>
              <div style={loginUser?.userid === p?.userid ? {...nameCSS, textAlign: "right"} : {...nameCSS, textAlign: "left"}}>
                {check_name(p.usernickname) === 1 ? "" : p.usernickname}
              </div>
              <div style={loginUser?.userid === p?.userid ? myCSS : youCSS}>
                <div style={dataCSS}>{p.data_s}</div>
                <div style={{fontSize: "10px"}}>{p.time}</div>
              </div>
            </div>
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
