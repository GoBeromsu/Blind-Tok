import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams, Link } from "react-router-dom";
import { getChat_list } from '../../data/chat_list';
import { getFriendlist } from '../../data/friend_data';
import { getChatData } from '../../data/chat_data';

const ChatRoom = () => {
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

    return (
        <div>
            {chatRoom.chat_data.map((user) => (
                <div key={user.user_id} className="text" style={{ width: `100px`, height:'50px' }}>
                    <div>{user.user_nickname}</div>
                    <div>{user.data}</div>
                    <div>{user.time}</div>
                </div>
            ))}
        </div>
    );
};

export default ChatRoom;
