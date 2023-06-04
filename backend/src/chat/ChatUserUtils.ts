import UserSession from "./UserSession";
import UserRegistry from "./UserRegistry";

let userRegistry = new UserRegistry();

export function newUser(userid: string) {
  const userSession = new UserSession(userid);
  userRegistry.register(userSession);
}
// 해당 유저의 roomlist에 방을 추가하는 함수
// 유저를 찾아서 없으면 유저를 생성해준다.
// 그 후 roomlist에 방을 추가한다.
export function updateRoomList(roomid: number, userList: any) {
  if (!userList) return;

  for (let i = 0; i < userList.length; i++) {
    const userid = userList[i].userid;
    let user = userRegistry.getById(userid);
    if (!user) {
      newUser(userid);
      user = userRegistry.getById(userid);
    }
    user.roomlist = [roomid, ...user?.roomlist];
  }
}

// 해당 유저의 roomlist에서 해당 방을 삭제하는 함수
// 해당 유저를 찾고 방 목록에서 방을 빼고 이를 다시 저장한다.
export function removeRoomList(roomid: number, userid: string) {
  const user = userRegistry.getById(userid);
  if (!user) {
    console.error("User not found");
    return;
  }
  user.roomlist = user?.roomlist.filter(room => room !== roomid);
}
// 유저가 속한 방 리스트를 가져오는 함수
// 유저를 찾아서 roomlist를 반환한다.
export function getRoomList(userid: string) {
  const user = userRegistry.getById(userid);
  return user?.roomlist;
}
// updateRoomList와 동일하지만 이는 단일 유저에게 적용되는 함수
export function addRoomList(roomid: number, userid: string) {
  let user = userRegistry.getById(userid);
  if (!user) {
    newUser(userid); // We reuse the user if it's just created
    user = userRegistry.getById(userid);
  }
  user?.roomlist.push({roomid});
}
