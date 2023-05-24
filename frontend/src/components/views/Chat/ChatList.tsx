// 필요한 모듈들을 임포트합니다.
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Modal from "react-modal";
import {getFriendListQuery} from "@data/Friend/state";
import "@style/ChatList.css";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "@data/user/state";
import {getChat_list} from "@data/chat/chat_list";
import {createRoom} from "../../../socket";
import Loading from "@loading/Loading";
import Error from "@views/Error/Error";

Modal.setAppElement("#root");

// 외부에서 접근 가능한 함수를 선언합니다. 초기에는 아무것도 하지 않는 함수로 설정합니다.
export let setList: any = () => {};

const ChatList: React.FC = () => {
  const loginUser: any = useRecoilValue(userState);

  if (!loginUser) {
    return <Loading />;
  }

  const {isLoading, isError, data, error} = getFriendListQuery(loginUser?.userid);
  // 여러 상태를 선언합니다. 이들은 대화방, 친구목록, 창 크기 등을 관리합니다.
  const [addFriendList, setAddFriendList]: any = useState([]);
  const [chatList, setChatList] = useState<any>(getChat_list());
  const [friendList, setFriendList] = useState<any>([]);
  const [windowWidth, setWindowWidth] = useState<any>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<any>(window.innerHeight);
  const [W, setW] = useState<any>(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  const [search, setSearch] = useState("");
  const [search_f, setSearch_f] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // useEffect를 사용해 로그인 사용자가 변경될 때마다 친구 목록을 다시 불러옵니다.
  useEffect(() => {
    if (data) {
      let friendIdList = data.map((user: any) => ({userid: user.friendid}));
      setFriendList(friendIdList);
    }
  }, [loginUser, data]);

  // 에러가 발생했다면 에러 컴포넌트를 반환합니다.
  if (isError) {
    return <Error error={error}></Error>;
  }

  // 창 크기가 변경될 때마다 상태를 업데이트하는 함수입니다.
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  };

  // 채팅방 목록을 업데이트하는 함수입니다.
  setList = () => {
    setChatList(getChat_list());
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

  // 초대할 목록에 인원을 추가하는 함수
  const add_list = (friend_n: any) => {
    if (!addFriendList.find((friend: any) => friend.userid === friend_n.userid)) {
      setAddFriendList([friend_n, ...addFriendList]);
      //setFriendList(friendList.filter((friend)=>friend.id !== friend_n.id));
    }
  };
  // 초대할 목록에서 인원을 뺄 함수
  const sub_list = (friend_n: any) => {
    setAddFriendList(addFriendList.filter((friend: any) => friend.userid !== friend_n.userid));
    //setFriendList([friend_n, ...friendList]);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  const filteredChatRoom = chatList.filter((chat: any) => {
    if (!chat.room_name) return;
    return chat.room_name.toLowerCase().includes(search.toLowerCase());
  });

  const SearchChange = (event: any) => {
    setSearch_f(event.target.value);
  };

  return (
    <div className="f_list" style={{width: `${windowWidth - 300}px`}}>
      <h1>Chating Room</h1>
      <input type="text" placeholder="Search" value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />
      <button onClick={() => setModalIsOpen(true)}> 추가</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setAddFriendList([]);
        }}
        style={M_style}>
        <div className="modal" style={{display: "flex", overflow: "auto", gap: "30px"}}>
          {addFriendList.map((friend: any, index: number) => (
            <div
              key={index}
              style={{height: "50px"}}
              onClick={() => {
                sub_list(friend);
              }}>
              {friend.userid}
            </div>
          ))}
        </div>
        <input type="text" placeholder="Search" value={search_f} onChange={SearchChange} style={{position: "sticky", top: "0px"}} />
        <div className="f_item">
          {friendList.map((friend: any, index: number) => (
            <div
              key={index}
              style={{width: `${W}px`, height: "50px"}}
              onClick={() => {
                add_list(friend);
              }}>
              {friend.userid}
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
