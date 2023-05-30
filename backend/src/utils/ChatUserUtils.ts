let chatUserData: {
  userid: string;
  roomlist: {roomid: number}[];
}[] = [];

// 새로운 유저 생성
export function newUser(userid: string) {
  let data_n = {
    userid: userid,
    roomlist: new Array(),
  };
  chatUserData = [...chatUserData, data_n];
}

// 해당 유저의 roomlist에 방을 추가하는 함수
// 유저를 찾아서 없으면 유저를 생성해준다.
// 그 후 roomlist에 방을 추가한다.
export function updateRoomList(roomid: number, userList: any) {
  if (!userList) return;
  console.log(userList);

  for (let i = 0; i < userList.length; i++) {
    let index = chatUserData.findIndex(user => user.userid === userList[i].userid);
    if (index == -1) {
      newUser(userList[i].userid);
      index = chatUserData.length - 1;
    }
    chatUserData[index] = {userid: chatUserData[index].userid, roomlist: [{roomid: roomid}, ...chatUserData[index].roomlist]};

    console.log("updateRoomList : ");
    console.log(chatUserData);
  }
}

// 해당 유저의 roomlist에서 해당 방을 삭제하는 함수
// 해당 유저를 찾고 방 목록에서 방을 빼고 이를 다시 저장한다.
export function removeRoomList(roomid: number, userid: string) {
  // 예외 처리
  if (!Array.isArray(chatUserData)) {
    console.error("Data is undefined or not an array");
    return;
  }
  let user = chatUserData.find(data => {
    data.userid === userid;
  });
  if (typeof user === "undefined") return;
  user.roomlist = user.roomlist.filter(room => room.roomid != roomid);
  chatUserData = chatUserData.map((data: any) => (data.userid === userid ? user : data));
  console.log("removeRoomList : ");
  console.log(chatUserData);
}

// 유저가 속한 방 리스트를 가져오는 함수
// 유저를 찾아서 roomlist를 반환한다.
export function getUserRoomList(userid: string) {
  if (!Array.isArray(chatUserData)) {
    console.error("Data is undefined or not an array");
    return [];
  }
  let user = chatUserData.find(data => data.userid === userid);
  if (!user) {
    newUser(userid);
    return [];
  }
  return user.roomlist;
}

// updateRoomList와 동일하지만 이는 단일 유저에게 적용되는 함수
export function userAddRoom(roomid: number, userid: string) {
  let index = chatUserData.findIndex(data => data.userid === userid);
  if (index == -1) {
    newUser(userid);
    index = chatUserData.length - 1;
  }
  chatUserData[index].roomlist.push({roomid: roomid});
  console.log(chatUserData[index]);
}

// test
export function show_u() {
  console.log("user_roomList : ");
  console.log(chatUserData);
}
