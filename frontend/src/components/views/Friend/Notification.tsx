import React, {useState, useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import {userState} from "@data/user/state";
import {useRecoilState} from "recoil";
import {Box, Input, Button} from "@mui/material";
import Modal from "react-modal";
import {getRelation, editFriendStatus, removeRelation, acceptFriend} from "@data/Friend/axios";
import {send} from "vite";

Modal.setAppElement("#root");

const Notification = () => {
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [receiveList, setReciveList] = useState<any>([]);
  const [sendList, setSendList] = useState<any>([]);
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

  const ok = async (relationid: number, status: string) => {
    try {
      await editFriendStatus(relationid, status);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (loginUser) {
      getRelation(loginUser.userid).then(data => {
        let list = data.data;
        list = list?.filter((relation: any) => relation.status === "wait");
        setReciveList(list.filter((relation: any) => relation.friendid === loginUser.userid));
        setSendList(list.filter((relation: any) => relation.userid === loginUser.userid));
      });
    }
  }, [loginUser]);

  const [search, setSearch] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  /*
  const filteredFriends = notificationList?.filter(
    (friend: any) => friend.userid?.toLowerCase().includes(search.toLowerCase()) && friend.userid === loginUser.userid,
  );
  */

  const cancleEvent = async (relationid: number) => {
    try {
      await removeRelation(relationid);
      setSendList(sendList.filter((message: any) => message.relationid !== relationid));
    } catch (error) {
      throw error;
    }
  };

  const acceptEvent = async (relationid: number, userid: number) => {
    try {
      ok(relationid, "normal");
      await acceptFriend(loginUser.userid, userid);
      setReciveList(receiveList.filter((message: any) => message.relationid !== relationid));
    } catch (error) {
      throw error;
    }
  };

  const refuseEvent = async (relationid: number) => {
    try {
      await removeRelation(relationid);
      setReciveList(receiveList.filter((message: any) => message.relationid !== relationid));
    } catch (error) {
      throw error;
    }
  };

  return (
    <Box className="f_list" style={{paddingLeft: "350px"}}>
      <h1>Friend List</h1>
      <Input type="text" placeholder="Search friends..." value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />
      <Box className="f_item">
        {receiveList?.map((req: any, index: any) => (
          <Box key={index} className="friend-item" style={{/*width: `${W}px`,*/ height: "50px"}} onClick={() => {}}>
            {req.userid}에게 친구요청이 왔습니다.
            <Button
              onClick={() => {
                acceptEvent(req.relationid, req.userid);
              }}>
              수락
            </Button>
            <Button
              onClick={() => {
                refuseEvent(req.relationid);
              }}>
              거절
            </Button>
          </Box>
        ))}
      </Box>
      <Box className="f_item">
        {sendList?.map((req: any, index: any) => (
          <Box
            key={index}
            className="friend-item"
            style={{/*width: `${W}px`,*/ height: "50px"}}
            onClick={() => {
              console.log(receiveList);
              console.log(sendList);
            }}>
            {req.friendid}에게 친구요청을 보냈습니다.
            <Button
              onClick={() => {
                cancleEvent(req.relationid);
              }}>
              취소
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
