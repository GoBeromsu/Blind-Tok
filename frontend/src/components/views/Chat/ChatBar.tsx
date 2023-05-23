import React, {useState, useEffect} from "react";
import Button from "../Layout/Button";
import C_Image from "../Layout/CircularImage";
import "../../style/SideBar.css";
import MessageBox from "../MainPage/MessageBox";
//import BTlogo from "/image/BTlogo";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {leaveRoom, addUser} from "../../../socket";
import {useRecoilValue} from "recoil";
import {userState} from "@data/user/state";
import Modal from "react-modal";
import {getFriendListQuery} from "@data/Friend/state";

const ChatBar: React.FC = () => {
  const {room_id} = useParams();
  const navigate = useNavigate();
  const loginUser: any = useRecoilValue(userState);
  const {isLoading, isError, data, error, refetch} = getFriendListQuery(loginUser?.userid);
  const [friendList, setFriendList] = useState<any>([]);
  const [addFriendList, setAddFriendList]: any = useState([]);
  const [search_f, setSearch_f] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleClick = () => {};
  const leave = () => {
    if (room_id) {
      leaveRoom(room_id);
      navigate("/chat");
    } else "leaveRoom error : room_id undefined";
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
  // 초대할 목록에 인원을 추가하는 함수
  const add_list = (friend_n: any) => {
    if (!addFriendList.find((friend: any) => friend.user_id === friend_n.user_id)) {
      setAddFriendList([friend_n, ...addFriendList]);
      //setFriendList(friendList.filter((friend)=>friend.id !== friend_n.id));
    }
  };
  // 초대할 목록에서 인원을 뺄 함수
  const sub_list = (friend_n: any) => {
    setAddFriendList(addFriendList.filter((friend: any) => friend.user_id !== friend_n.user_id));
    //setFriendList([friend_n, ...friendList]);
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

  const SearchChange = (event: any) => {
    setSearch_f(event.target.value);
  };

  const filteredFriends = friendList; //.filter((friend: any) => friend.userid.toLowerCase().includes(search_f.toLowerCase()));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //const image = require("");

  return (
    <div style={{display: "flex"}}>
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
              {friend.user_id}
            </div>
          ))}
        </div>
        <input type="text" placeholder="Search" value={search_f} onChange={SearchChange} style={{position: "sticky", top: "0px"}} />
        <div className="f_item">
          {filteredFriends.map((friend: any, index: number) => (
            <div
              key={index}
              style={{width: `30px`, height: "50px"}}
              onClick={() => {
                add_list(friend);
              }}>
              {friend.user_id}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            addUser(room_id, addFriendList);
            setModalIsOpen(false);
            setAddFriendList([]);
          }}
          style={{width: "50px", height: "50px"}}>
          확인
        </button>
      </Modal>
      <div className={`sidebar${sidebarOpen ? "" : " closed"}`}>
        <div className="test">
          <div className="sidebar_main">
            <div className="item">
              <Link to="/friend">
                <Button onClick={handleClick} label="친구 목록" />
              </Link>
              <br />
            </div>
            <br />
            <br />
            <div className="item">
              <Button onClick={handleClick} label="검색" />
            </div>
            <div className="item">
              <Button onClick={() => {
                setModalIsOpen(true);
                getFriendList(data);
              }} label="추가" />
              <br />
            </div>
            <div className="item">
              <Button onClick={handleClick} label="알림" />
              <br />
            </div>
            <div className="item">
              <Link to="/User">
                <Button onClick={handleClick} label="설정" />
              </Link>
              <br />
            </div>
            <div className="item">
              <Button onClick={leave} label="방 나가기" />
              <br />
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default ChatBar;
