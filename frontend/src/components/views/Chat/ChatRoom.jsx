import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams, Link } from "react-router-dom";
import { getChat_list } from '../../../data/chat_list';
import { getFriendlist } from '../../../data/friend_data';
import { getChatData, updateChatData } from '../../../data/chat_data';

const ChatRoom = ({user}) => {
    useEffect(()=>{
        updateChatData({...chatRoom, data : chat_data});
    },[]);
    const myCSS ={
        display: "flex",
        alignItems: "flex-end",
        borderStyle: "solid",
        borderWidth: "0px",
        margin: "5px",
        maxWidth: "800px",
        backgroundColor: "rgba(30, 150, 100, 0.1)",
    };
    const youCSS ={
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "row-reverse",
        borderStyle: "solid",
        borderWidth: "0px",
        margin: "5px",
        maxWidth: "800px",
        backgroundColor: "rgba(30, 150, 100, 0.1)",
    };
    const nameCSS ={
        borderStyle: "solid",
        borderWidth: "0px",
        margin: "5px",
        fontSize: "20px",
        fontWeight: "700",
    };
    const dataCSS ={
        borderStyle: "solid",
        borderWidth: "0px",
        margin: "5px",
        maxWidth: "400px",
        backgroundColor: "rgba(30, 150, 100, 0.1)",
    };

    const params = useParams();
    const chatRoom = getChatData(parseInt(params.room_id));
    const location = useLocation();
    //console.log(location);

    const [searchParams, setSearchParams] = useSearchParams();
    const detail = searchParams.get("detail");

    const handleClick = () => {
        setSearchParams({ detail: detail === "true" ? false : true });
        console.log(detail);
    };

    const [chat_data, setChat_data] = useState(chatRoom.data);
    const [string, setString] = useState("");
    let check_n = "";

    const updateChat = (data) => {
        setChat_data([...chat_data,data]);
        updateChatData({...chatRoom, data : data});
    };

    const click = (e)=>{
        let today = new Date();   
        let hours = today.getHours(); // 시
        hours = hours < 10 ? "0"+hours : hours; // 자릿수 맞추기
        let minutes = today.getMinutes();  // 분
        minutes = minutes < 10 ? "0"+minutes : minutes; // 자릿수 맞추기
        const data = {
            num : chat_data.at(-1).num + 1,
            user_id : user.user_id,
            user_nickname : user.nickname,
            time : `${hours} : ${minutes}`,
            data_s : string,
        };
        updateChat(data);
        setString("");
    };

    const textChange = (e) => {
        setString(e.target.value);
    };

    const check_name = (str) =>{
        if(str === check_n) return 1;
        else {
            check_n = str;
            return 0;
        } 
    };

    return (
        <div>
            <div style={{ width: `100%`, height:'100%' }}>
                <div style={{ width: `100%`, height:'90%' }}>
                    {chat_data.map((p) => (
                        <div key={p.num} className="text" style={{width:"800px"}}>
                            <div style={user.user_id===p.user_id ? {...nameCSS, textAlign:"left"} : {...nameCSS, textAlign: "right"}}
                            >{check_name(p.user_nickname) === 1 ? "" : p.user_nickname}</div>
                            <div style={user.user_id===p.user_id ? myCSS : youCSS}>
                                <div style={dataCSS}>{p.data_s}</div>
                                <div style={{fontSize: "10px"}}>{p.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <input type="text" placeholder="" value={string} onChange={textChange} style={{ width: `93%`, height:'9%'}} />
                    <button onClick={click}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;