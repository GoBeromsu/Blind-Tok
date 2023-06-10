import React, {useState, useEffect} from "react";
import {Link, Outlet} from "react-router-dom";
import {userState, sideState} from "@data/user/state";
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
  const [sidebarOpen, setSidebarOpen]: any = useRecoilState(sideState);
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

  const list_style: any = {
    height: "50px",
    width: "600px", // 너비 일정하게 설정
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 0",
    borderRadius: "8px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    paddingLeft: "10px", // 텍스트 왼쪽 정렬을 위한 padding
    transition: "background-color 0.3s", // 호버 효과를 위한 트랜지션
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
        console.log(list);
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
    <Box className="flist" style={sidebarOpen ? {paddingLeft: "850px"} : {paddingLeft: "120px"}}>
      <h1 style={{textAlign: "center"}}>Alarm</h1>
      {/*<Input type="text" placeholder="Search friends..." value={search} onChange={handleSearchChange} style={{position: "sticky", top: "30px"}} />*/}
      <h3>Receive</h3>
      <Box className="fitem" style={{width: "100%", overflowY: "auto"}}>
        {receiveList?.map((req: any, index: any) => (
          <Box key={index} className="friend-item" style={list_style} onClick={() => {}}>
            {req.userid}에게 친구요청이 왔습니다.
            <Box>
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
          </Box>
        ))}
      </Box>
      <h3>Send</h3>
      <Box className="fitem" style={{width: "100%", overflowY: "auto"}}>
        {sendList?.map((req: any, index: any) => (
          <Box
            key={index}
            className="friend-item"
            style={list_style}
            onClick={() => {
              console.log(receiveList);
              console.log(sendList);
            }}>
            {req.friendName}에게 친구요청을 보냈습니다.
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
