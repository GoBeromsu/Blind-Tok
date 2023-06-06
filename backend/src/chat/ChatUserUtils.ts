import UserSession from "./UserSession";
import {addRoomUser, checkData, findRoom, removeUserList, updateRoom} from "./ChatRoomUtils";
import {ChatRoomData, rooms, sendMessage, userRegistry} from "./Consonants";

export function newUser(userid: string, socket: any) {
  if (userRegistry.getById(userid)) {
    return userRegistry.getById(userid);
  }
  const userSession = new UserSession(userid, socket);
  userRegistry.register(userSession);
  return userSession;
}
// 해당 유저의 roomlist에 방을 추가하는 함수
// 유저를 찾아서 없으면 유저를 생성해준다.
// 그 후 roomlist에 방을 추가한다.
export function updateRoomList(roomid: number, userList: any) {
  userList.map((userid: string) => {
    const user = userRegistry.getById(userid);
    if (!user) return;
    userRegistry.setRoomList(userid, [rooms[roomid], ...user?.roomlist]);
  });

  // console.log("user's roomlist : ", userRegistry.getById(userList[0])?.roomlist);
}

// 해당 유저의 roomlist에서 해당 방을 삭제하는 함수
// 해당 유저를 찾고 방 목록에서 방을 빼고 이를 다시 저장한다.
export function removeRoomList(roomid: number, userid: string) {
  const user = userRegistry.getById(userid);
  if (!user) {
    console.error("User not found");
    return;
  }
  const roomlist = user?.roomlist.filter(room => room.roomid !== roomid);
  userRegistry.setRoomList(userid, roomlist);
}
// 유저가 속한 방 리스트를 가져오는 함수
// 유저를 찾아서 roomlist를 반환한다.
export function getUserRooms(userid: string) {
  const user = userRegistry.getById(userid);
  return user?.roomlist;
}
// updateRoomList와 동일하지만 이는 단일 유저에게 적용되는 함수
export function addRoomList(roomid: number, userid: string) {
  let user = userRegistry.getById(userid);

  user?.roomlist.push(rooms[roomid]);
}

// 유저와 유저의 소켓을 묶어서 저장하는 변수
// [{userid : string, mySocket : any}]

export function updateUserSocket(socket: any, userid: string) {
  // user.socket = socket;
  console.log("update User Socket ", userid, socket.id);
  userRegistry.updateSocket(userid, socket);
}

export function sendOfflineMessages(io: any, socket: any, roomList: any[], userid: string) {
  roomList.forEach(room => {
    let roomid = room.roomid;
    let data = checkData(roomid, userid);
    sendMessage(socket, {data: {roomid, data}, id: "chatData"});
    // console.log("chatData : " + roomid + data);
  });
}

export function dataInit(io: any, socket: any, userid: string) {
  newUser(userid, socket);

  updateUserSocket(socket, userid);
  // const roomList = getUserRooms(userid);
  // 유저가 속한 방에 연결
  // roomList.map(room => {
  //   joinRoom(socket, room);
  // });

  // 유저가 속한 방 리스트
  // io.to(socket.id).emit("message", {data: roomList.map((data: any) => findRoom(data)), id: "chatList"});
  // sendOfflineMessages(io, socket, roomList, userid);
}

// 유저가 방을 나갈때 이를 처리하는 함수
// 유저와 해당 방의 접속을 끊는다.
// 유저의 id를 받지 않기 때문에 userlist에서 해당 소켓이 가진 유저 userid 를 찾는다.
// removeRoomList : ChatRoomUtils의 해당 방 데이터의 유저 리스트에서 유저를 삭제한다.
// removeUserList : ChatUserUtils의 해당 유저의 데이터의 방 리스트에서 방을 삭제한다.
// 그 후 해당 방의 유저 목록을 가져와 어느 유저가 나갔는지 알려준다.
export function leaveRoom(io: any, socket: any, roomid: number, userid: string) {
  socket.leave(roomid);
  // let userid = Participants.find((user: any) => user.mySocket === mySocket).userid;

  removeRoomList(roomid, userid);
  removeUserList(roomid, userid);
  const room = findRoom(roomid);
  if (!room) return;
  let userList = room?.userlist;
  if (userList) route(io, userList, "leaveRoom", {roomid, userid});
  console.log("success leave / room : " + roomid + " / user : " + userid);
}

// 메시지를 받았을 경우 처리 함수
// 메시지에서 roomid를 추출
// updateRoom : ChatRoomUtils의 해당 방의 데이터를 갱신하고 데이터를 다시 반환
// 이 반환 받은 데이터를 방에 속한 유저와 보낸 유저에게 전송
export function enteredMessage(
  io: any,
  socket: any,
  data: {
    roomid: number;
    userid: number;
    nickname: string;
    time: string;
    data_s: any;
  },
) {
  let {roomid, ...rest} = data;
  // console.log("rest : ", rest);

  let room = updateRoom(roomid, rest);
  // console.log("update ? room : ", room);
  // const room = findRoom(roomid);
  room?.userlist?.map((userid: any) => {
    const userSocket = userRegistry.getSocketById(userid);
    if (!userSocket) {
      console.log("user not found : 유저가 아직 접속을 하지 않았습니다");
      return;
    }
    console.log("userSocket : ", userSocket?.id, " / userid : ", userid, " / room : ", room);
    // console.log("All User :", userRegistry.getAll());
    sendMessage(userSocket, {data: room, id: "message"});
  }); // 방에 있는 모든 유저
  // socket.to(roomid).emit("message", {data: room, id: "message"}); // 방 하나만
  // io.to(socket.id).emit("message", {data: room, id: "message"}); // 특정 인원에게 전달 가능
}

// 소켓과 방 아이디를 가진 리스트를 받아
// 해당 소켓을 방에 연결시키는 함수
export function joinRoom(socket: any, room: any) {
  // console.log("joinRoom : ", roomList);
  socket.join(room);
  // roomList.map((room: any) => socket.join(room) && console.log("join : ", room));
}

export function getRooms(socket: any) {
  const user = userRegistry.getBySocket(socket?.id);
  const rooms = getUserRooms(user?.userid);
  // console.log("getRooms", rooms, userRegistry.getAll());
  // console.log("getRooms : ", user, user?.userid, rooms);
  sendMessage(socket, {id: "getRooms", data: rooms});
}

export function notifyUsersConnect(io: any, room: ChatRoomData) {
  // console.log("notifyUsersConnect : ", room);
  const {userlist} = room;
  console.log("notifyUsersConnect : ", userlist);
  userlist.map((userid: any) => {
    const connectedUser = userRegistry.getById(userid);
    if (connectedUser) {
      // console.log("처음 유저의 소켓 : ", connectedUser.socket.id);
      // io.to(connectedUser.socket.id).emit("message", {data: room, id: "createRoom"}); // 방에 참여한 유저에게 방이 생성되었다는 사실을 알림
      sendMessage(connectedUser.socket, {data: room, id: "createRoom"}); // 방에 참여한 유저에게 방이 생성되었다는 사실을 알림
      // connectedUser.socket.join(room.roomid); // 방에 참여한 유저를 방에 연결
      console.log("success join / room : " + room.roomid + " / user : " + userid);
      joinRoom(connectedUser.socket, room);
    } else {
      console.log("fail join / room : " + room.roomid + " / user : " + userid);
    }
  });
  // console.log(userRegistry.getAll());
}

// 특정 유저리스트에 무언가를 보내고 싶을 때 사용하는 함수
// opt : 보내는 메세지의 속성
// 현재 접속해있는지 확인하여 route_createRoom과 동일하게 메시지를 전달한다.
export function route(io: any, userList: any, opt: string, data: any) {
  userList.forEach((user: any) => {
    let connectedUser = userRegistry.getById(user.userid);

    if (!connectedUser) {
      console.warn(`User ${user.userid} is not connected.`);
      return; // skip this iteration
    }
    io.to(connectedUser.socket.id).emit("message", {data: data, id: opt});
  });
}

// 방에 유저가 추가되었을 경우 이를 처리하는 함수
// 유저는 배열 형태로 전달된다.
// 배열에 있는 유저마다 처리를 해준다.
// addRoomUser : ChatRoomUtils에 있는 해당 방의 데이터에 userlist가 존재하는데 여기에 유저를 추가한다.
// addRoomList : ChatUserUils에 있는 유저 데이터에 roomlist가 있는데 여기에 해당 방을 추가한다.
// 이는 차후에 유저가 서버에 접속하면 방 목록을 요청하고 부재 중 시 받은 데이터를 처리하는데 사용된다.
// 그 후 추가된 유저를 해당 방에 연결시킨다. (join)
// 마지막으로 해당 유저가 추가되었다는 사실을 방에 속한 유저에게 보내고
// 추가된 유저에게도 방에 접속했다는 사실을 보낸다. => 이를 통해 추가된 유저의 방 목록 갱신이 가능
export function add_user(io: any, data: {roomid: number; userlist: any[]}) {
  const {roomid, userlist} = data;
  userlist.map((user: any) => {
    addRoomUser(roomid, user.userid);
    addRoomList(roomid, user.userid);
    userRegistry.getById(user.userid)?.socket.join(roomid);
  });
  let currentRoomData = findRoom(roomid);
  route(io, currentRoomData?.userlist, "addUser", data);
  route(io, userlist, "addRoom", currentRoomData);
}
