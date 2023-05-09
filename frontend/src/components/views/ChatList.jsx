import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/ChatList.css';
import Modal from 'react-modal';
import { getChat_list } from '../../data/chat_list';
import { getFriendlist } from '../../data/friend_data';

const ChatList = ({user}) => {
    const [chatList, setChatList] = useState(getChat_list(user.user_id));
    const [friendList, setFriendList] = useState(getFriendlist(user.user_id));
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [W, setW] = useState(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
        setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
    };

    const M_style = {
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
            justifyContent: "center",
            background: "#ffffff",
            overflow: "auto",
            inset: "100px 100px 100px 400px",
            WebkitOverflowScrolling: "touch",
            borderRadius: "14px",
            outline: "none",
            zIndex: 10,
        },
    };


    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [search, setSearch] = useState('');

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const filteredChatRoom = chatList.filter((chat) =>
        chat.room_name.toLowerCase().includes(search.toLowerCase())
    );

    const [search_f, setSearch_f] = useState('');

    const SearchChange = (event) => {
        setSearch_f(event.target.value);
    };

    const filteredFriends = friendList.filter((friend) =>
        friend.nickname.toLowerCase().includes(search_f.toLowerCase())
    );

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <div className="f_list" style={{ width: `${windowWidth - 300}px` }}>
            <h1>Chating Room</h1>
            <input type="text" placeholder="Search" value={search} onChange={handleSearchChange} style={{ position: 'sticky', top: '30px' }} />
            <button onClick={() => setModalIsOpen(true)} > 추가</button>
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={M_style}>
                <div className="f_item" >
                    <input type="text" placeholder="Search" value={search_f} onChange={SearchChange} style={{ position: 'sticky', top: '30px' }} />
                    {filteredFriends.map((friend) => (
                        <div key={friend.id} className="friend-item" style={{ width: `${W}px`, height:'50px' }}>
                            <Link to={`/friend_s/${friend.id}`}>{friend.nickname}</Link>
                        </div>
                    ))}
                </div>
                <button onClick={() => setModalIsOpen(false)} style={{width:'50px', height:'50px'}}>확인</button>
            </Modal>
            <div className="f_item" >
                {filteredChatRoom.map((chat) => (
                    <div key={chat.room_id} className="friend-item" style={{ width: `${W}px`, height:'50px' }}>
                        <Link to={`/ChatRoom/${chat.room_id}`}>{chat.room_name}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;