import React, {useState, useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import {userState} from "@data/user/state";
import {useRecoilState} from "recoil";
import {Box, Input, Button} from "@mui/material";
import Modal from "react-modal";
import {getFriendlist, editFriendStatus} from "@data/Friend/axios";

Modal.setAppElement("#root");

const Notification = () => {
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [notificationList, setNotificationList] = useState<any>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
      inset: "100px 300px",
      WebkitOverflowScrolling: "touch",
      borderRadius: "14px",
      outline: "none",
      zIndex: 10,
      flexDirection: "column",
      flexWrap: "nowrap",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: "10px 30px",
      height: "70vh",
    },
  };

  const ok = (relationid: number, status: string) => {
    editFriendStatus(relationid, status);
  };

  useEffect(() => {
    if (loginUser) {
      getFriendlist(loginUser.userid).then(data => {
        setNotificationList(data.data);
      });
    }
  }, [loginUser]);

  const [search, setSearch] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredFriends = notificationList?.filter(
    (friend: any) => friend.userid?.toLowerCase().includes(search.toLowerCase()) && friend.userid === loginUser.userid,
  );

  return (
    <Box className="f_list" style={{paddingLeft: "350px"}}>
      <h1>Friend List</h1>
      <Input type="text" placeholder="Search friends..." value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />
      <Box className="f_item">
        {filteredFriends?.map((friend: any, index: any) => (
          <Box
            key={index}
            className="friend-item"
            style={{/*width: `${W}px`,*/ height: "50px", backgroundColor: friend.status === "ban" ? "red" : "black"}}
            onClick={() => {
              console.log(getFriendlist(loginUser?.userid));
            }}>
            {friend.friendid}에게 친구요청이 왔습니다.
            <Button
              onClick={() => {
                ok(Number(friend.relationid), "normal");
                let relationid = notificationList.find((user: any) => user.userid === friend.friendid).relationid;
                ok(Number(relationid), "normal");
                getFriendlist(loginUser.userid).then(data => {
                  setNotificationList(data.data);
                });
              }}>
              수락
            </Button>
            <Button
              onClick={() => {
                ok(Number(friend.relationid), "ban");
                console.log(notificationList);
                let relationid = notificationList.find((user: any) => user.userid === friend.friendid).relationid;
                ok(Number(relationid), "ban");
                getFriendlist(loginUser.userid).then(data => {
                  setNotificationList(data.data);
                });
              }}>
              거절
            </Button>
          </Box>
        ))}
      </Box>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        style={M_style}>
        <Outlet />
        <Button
          onClick={() => {
            setModalIsOpen(false);
          }}
          style={{width: "50px", height: "50px", alignSelf: "flex-end"}}>
          확인
        </Button>
      </Modal>
    </Box>
  );
};

export default Notification;
