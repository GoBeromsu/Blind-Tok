import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {userState} from "@data/user/state";
import {useRecoilValue} from "recoil";
import {getFriendListQuery} from "@data/Friend/state";

interface Friend {
  id: number;
  nickname: string;
}

const FriendList = () => {
  const loginUser: any = useRecoilValue(userState);
  const {isLoading, isError, data, error} = getFriendListQuery(1);
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [W, setW] = useState<number>(window.innerWidth < 850 ? window.innerWidth - 350 : 500);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [search, setSearch] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredFriends = friendList.filter(friend => friend.nickname.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="f_list" style={{width: `${windowWidth - 300}px`}}>
      <h1>Friend List</h1>
      <input type="text" placeholder="Search friends..." value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />
      <div className="f_item">
        {filteredFriends.map(friend => (
          <div key={friend.id} className="friend-item" style={{width: `${W}px`, height: "50px"}}>
            <Link to={`/friend_s/${friend.id}`}>{friend.nickname}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
