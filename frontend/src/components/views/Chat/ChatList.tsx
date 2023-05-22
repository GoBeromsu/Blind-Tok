import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Modal from "react-modal";
import {getFriendListQuery} from "@data/Friend/state";
import "@style/ChatList.css";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@data/user/state";
import {getChat_list} from "@data/chat/chat_list";
import {createRoom, createSocket} from "../../../socket";
import Loading from "@loading/Loading";
import Error from "@views/Error/Error";

export let setList: any = () => {};

const ChatList: React.FC = () => {
  const loginUser: any = useRecoilValue(userState);
  if (!loginUser) {
    // loginUser not loaded yet, can return a loading screen or null
    return <Loading />;
  }
  const {isLoading, isError, data, error, refetch} = getFriendListQuery(loginUser?.userid);
  const [addFriendList, setAddFriendList]: any = useState([]);
  const [chatList, setChatList] = useState<any>(getChat_list());
  const [friendList, setFriendList] = useState<any>([]);
  const [windowWidth, setWindowWidth] = useState<any>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<any>(window.innerHeight);
  const [W, setW] = useState<any>(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  useEffect(() => {
    if (!data) {
      refetch();
    }
  }, [loginUser, data]);
  if (isError) {
    return <Error error={error}></Error>;
  }

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  };

  setList = () => {
    setChatList(getChat_list());
  };

  const getFriendList = (data: any) => {
    let temp = data;
    if (temp) {
      temp = temp.map((data: any) => {
        return {user_id: data.friendid};
      });
      console.log(temp);
      setFriendList(temp);
    }
  };

  const M_style: any = {
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
      background: "#ffffff",
      overflow: "auto",
      inset: "100px 100px 100px 400px",
      WebkitOverflowScrolling: "touch",
      borderRadius: "14px",
      outline: "none",
      zIndex: 10,
      flexDirection: "column",
      flexWrap: "nowrap",
      alignItems: "stretch",
      justifyContent: "flex-start",
    },
  };

  const add_list = (friend_n: any) => {
    if (!addFriendList.find((friend: any) => friend.user_id === friend_n.user_id)) {
      setAddFriendList([friend_n, ...addFriendList]);
      //setFriendList(friendList.filter((friend)=>friend.id !== friend_n.id));
    }
  };
  const sub_list = (friend_n: any) => {
    setAddFriendList(addFriendList.filter((friend: any) => friend.user_id !== friend_n.user_id));
    //setFriendList([friend_n, ...friendList]);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [search, setSearch] = useState("");

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  const filteredChatRoom = chatList.filter((chat: any) => {
    if (!chat.room_name) return;
    return chat.room_name.toLowerCase().includes(search.toLowerCase());
  });

  const [search_f, setSearch_f] = useState("");

  const SearchChange = (event: any) => {
    setSearch_f(event.target.value);
  };

  const filteredFriends = friendList; //.filter((friend: any) => friend.userid.toLowerCase().includes(search_f.toLowerCase()));

  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="f_list" style={{width: `${windowWidth - 300}px`}}>
      <h1>Chating Room</h1>
      <input type="text" placeholder="Search" value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />
      <button
        onClick={() => {
          setModalIsOpen(true);
          getFriendList(data);
        }}>
        {" "}
        추가
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setAddFriendList([]);
        }}
        style={M_style}>
        <div className="f" style={{display: "flex", overflow: "auto", gap: "30px"}}>
          {addFriendList.map((friend: any, index: number) => (
            <div
              key={index}
              style={{height: "50px"}}
              onClick={() => {
                sub_list(friend);
              }}>
              {friend.user_id}
            </div>
          ))}
        </div>
        <input type="text" placeholder="Search" value={search_f} onChange={SearchChange} style={{position: "sticky", top: "0px"}} />
        <div className="f_item">
          {filteredFriends.map((friend: any, index: number) => (
            <div
              key={index}
              style={{width: `${W}px`, height: "50px"}}
              onClick={() => {
                add_list(friend);
              }}>
              {friend.user_id}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            createRoom(loginUser, addFriendList);
            setModalIsOpen(false);
            setAddFriendList([]);
          }}
          style={{width: "50px", height: "50px"}}>
          확인
        </button>
      </Modal>
      <div className="f_item">
        {filteredChatRoom.map((chat: any, index: number) => (
          <div key={index}>
            <Link to={`/ChatRoom/${chat.room_id}`}>
              <div className="friend-item" style={{width: `${W}px`, height: "50px"}}>
                {chat.room_name}
                <br />
                {chat.last_Message}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
