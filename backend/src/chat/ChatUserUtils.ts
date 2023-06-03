import UserSession from "./UserSession";

let chatUserData: Record<string, UserSession> = {};

// 새로운 유저 생성
export function newUser(userid: string) {
  chatUserData[userid] = new UserSession(userid);
}
// 해당 유저의 roomlist에 방을 추가하는 함수
// 유저를 찾아서 없으면 유저를 생성해준다.
// 그 후 roomlist에 방을 추가한다.
export function updateRoomList(roomid: number, userList: any) {
  if (!userList) return;

  for (let i = 0; i < userList.length; i++) {
    const userid = userList[i].userid;
    if (!chatUserData[userid]) {
      newUser(userid);
    }
    const user = chatUserData[userid];
    user.roomlist = [roomid, ...user?.roomlist];

    console.log("updateRoomListWithUsers: ", chatUserData);
  }
}

// 해당 유저의 roomlist에서 해당 방을 삭제하는 함수
// 해당 유저를 찾고 방 목록에서 방을 빼고 이를 다시 저장한다.
export function removeRoomList(roomid: number, userid: string) {
  if (!chatUserData[userid]) {
    console.error("User not found");
    return;
  }

  chatUserData[userid].roomlist = chatUserData[userid].roomlist.filter(room => room.roomid !== roomid);

  console.log("removeRoomFromUser: ", chatUserData);
}

// 유저가 속한 방 리스트를 가져오는 함수
// 유저를 찾아서 roomlist를 반환한다.
export function getRoomList(userid: string) {
  if (!chatUserData[userid]) {
    console.error("User not found");
    return [];
  }

  return chatUserData[userid]?.roomlist;
}

// updateRoomList와 동일하지만 이는 단일 유저에게 적용되는 함수
export function addRoomList(roomid: number, userid: string) {
  if (!chatUserData[userid]) {
    newUser(userid);
  }

  chatUserData[userid]?.roomlist.push({roomid});
  console.log(chatUserData[userid]);
}
