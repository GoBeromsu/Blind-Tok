import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../style/FriendList.css';
import { getFriendlist } from '../../../data/friend_data';

const FriendList = ({user}) => {
    const [friendList, setFriendList] = useState(getFriendlist(user.user_id));
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [W, setW] = useState(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
        setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
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

    const filteredFriends = friendList.filter((friend) =>
        friend.nickname.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="f_list" style={{ width: `${windowWidth - 300}px` }}>
            <h1>Friend List</h1>
            <input type="text" placeholder="Search friends..." value={search} onChange={handleSearchChange} style={{position: 'sticky', top : '30px'}}/>
            <div className="f_item" >
                {filteredFriends.map((friend) => (
                    <div key={friend.id} className="friend-item" style={{ width: `${W}px`, height:'50px' }}>
                        <Link to={`/friend_s/${friend.id}`}>{friend.nickname}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendList;
