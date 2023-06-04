import UserSession from "./UserSession";
import UserRegistry from "./UserRegistry";
import {addRoomUser, checkData, createRoom, getRoomData, removeUserList, updateRoom} from "./ChatRoomUtils";
import {createData} from "./ChatDataUtils";

export let userRegistry = new UserRegistry();
export let Participants: any = {};

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

  user?.roomlist.push({roomid});
}

// 유저와 유저의 소켓을 묶어서 저장하는 변수
// [{userid : string, mySocket : any}]

export function updateUserSocket(socket: any, userid: string) {
  let user = userRegistry.getById(userid);
  user.socket = socket;
}

export function sendOfflineMessages(io: any, socket: any, list: any[], userid: string) {
  list.forEach(item => {
    let roomid = item.roomid;
    let data = checkData(roomid, userid);
    sendMessageToUser(socket, {data: {roomid, data}, id: "rec_chatData"});
    console.log("rec_chatData : " + roomid + data);
  });
}

export function data_init(io: any, socket: any, userid: string) {
  newUser(userid, socket);
  updateUserSocket(socket, userid);
  const roomList = getRoomList(userid) || [];
  // 유저가 속한 방에 연결
  userJoin(socket, roomList);
  // 유저가 속한 방 리스트
  io.to(socket.id).emit("rec_message", {data: make_RoomListData(roomList), id: "rec_chatList"});
  sendOfflineMessages(io, socket, roomList, userid);
}

// 유저가 방을 나갈때 이를 처리하는 함수
// 유저와 해당 방의 접속을 끊는다.
// 유저의 id를 받지 않기 때문에 userlist에서 해당 소켓이 가진 유저 userid 를 찾는다.
// removeRoomList : ChatRoomUtils의 해당 방 데이터의 유저 리스트에서 유저를 삭제한다.
// removeUserList : ChatUserUtils의 해당 유저의 데이터의 방 리스트에서 방을 삭제한다.
// 그 후 해당 방의 유저 목록을 가져와 어느 유저가 나갔는지 알려준다.
export function leave_room(io: any, socket: any, roomid: number, userid: string) {
  socket.leave(roomid);
  // let userid = Participants.find((user: any) => user.mySocket === mySocket).userid;

  removeRoomList(roomid, userid);
  removeUserList(roomid, userid);
  let list = getRoomData(roomid).userlist;
  if (list) route(io, list, "rec_leaveRoom", {roomid, userid});
  console.log("success leave / room : " + roomid + " / user : " + userid);
}

// 방 생성을 처리하는 함수
// 방을 생성할 때 보내온 유저도 포함하는 리스트를 생성
// createRoom : 방을 만들고 이에 대한 결과를 반환하는 함수 / 방 이름, 아이디, 유저리스트를 반환함
// 이를 가지고 방에 속한 유저에게 방에 대한 정보를 전송/ 이를 통해 클라이언트가 이벤트 발생을 확인하고 처리함
// updateRoomList : ChatUserUtils에서 해당 유저의 방 목록에 생성된 방의 아이디를 저장하는 함수
// createData : ChatDataUtils에서 해당 방의 데이터 저장 공간을 만드는 함수
// notifyUsersConnect : 방의 생성을 참여자에게 알리는 함수
export function create_room(io: any, data: {user: any; userlist: any; roomname: string}) {
  const {user, userlist, roomname} = data;
  let updatedUserList = [{userid: user.userid, nickname: user.nickname}, ...userlist];
  let createdRoom = createRoom(updatedUserList, roomname);
  if (createdRoom) {
    updateRoomList(createdRoom.roomid, updatedUserList);
    createData(createdRoom.roomid);
    notifyUsersConnect(io, createdRoom);
  }
}

// 연결 종료를 처리하는 함수
// 현재 접속하고 있는 유저의 정보를 저장한 userlist에서 해당 유저의 정보를 제거
// 이미 없다면 종료
export function disconnect(socket: any) {
  const user = userRegistry.getBySocket(socket);
  if (user) {
    userRegistry.unregister(user.userid);
  }
}

// 메시지를 받았을 경우 처리 함수
// 메시지에서 roomid를 추출
// updateRoom : ChatRoomUtils의 해당 방의 데이터를 갱신하고 데이터를 다시 반환
// 이 반환 받은 데이터를 방에 속한 유저와 보낸 유저에게 전송
export function processReceivedMessage(
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

  // console.log("update Room : ", roomid);
  // mySocket.broadcast.emit("receive_message", data); // 1 대 다수
  socket.to(roomid).emit("rec_message", {data: room, id: "rec_message"}); // 방 하나만
  io.to(socket.id).emit("rec_message", {data: room, id: "rec_message"}); // 특정 인원에게 전달 가능
}

// 소켓과 방 아이디를 가진 리스트를 받아
// 해당 소켓을 방에 연결시키는 함수
export function userJoin(socket: any, roomList: any) {
  console.log("userJoin : ", roomList);
  for (let l = 0; l < roomList.length; l++) {
    socket.join(roomList[l].roomid);
  }
}

// ChatRoomUtils에 저장된 데이터는 maxnum과 minnum등 불필요한 정보가 있다.
// 따라서 이를 제거하고 방의 이름, userid, 속한 유저 아이디 리스트만 가공하여 반환하는 함수
// getRoomData : 방 하나를 가공하는 함수
// 이 함수는 방 목록을 받아 목록에 있는 모든 방을 가공하여 반환한다.
export function make_RoomListData(list: any) {
  return list.map((data: any) => getRoomData(data));
}

// 방의 생성을 방에 속한 유저에게 알리고 유저를 방에 연결시키는 함수
// 방을 생성하면 그 방에 속한 유저를 연결시켜야된다.
// 또한 방에 속한 것을 유저에게 알려 유저의 방리스트 즉 chatList의 목록을 갱신시켜
// 실시간으로 방에 참여할수 있도록 만들어야된다.
// data.Participants.map : 주어진 유저리스트 마다 반복한다.
// Participants.find : 해당 방의 유저가 현재 접속해있는지 확인하고 그에 대한 소켓을 가져와야된다.
// 접속해있다면 해당 방에게 방이 만들어졌다는 사실을 알리고 방에 접속시킨다.
// 접속해있지 않다면 접속할 때 자신이 속한 방목록을 받게 되고 그때 접속되기 때문에 여기서 아무런 작업을 하지 않아도 된다.
export function notifyUsersConnect(io: any, data: {roomid: number; userlist: any[]; roomname: string}) {
  console.log("notifyUsersConnect : ", data);
  const {userlist} = data;

  userlist.map((user: any) => {
    const connectedUser = userRegistry.getById(user.userid);
    if (connectedUser) {
      io.to(connectedUser.socket.id).emit("rec_message", {data: data, id: "rec_createRoom"});
      connectedUser.socket.join(data.roomid);
    }
  });
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
    io.to(connectedUser.socket.id).emit("rec_message", {data: data, id: opt});
  });
}

function sendMessageToUser(socket: any, message: any) {
  socket.emit("rec_message", message);
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
  let currentRoomData = getRoomData(roomid);
  route(io, currentRoomData.userlist, "rec_addUser", data);
  route(io, userlist, "rec_addRoom", currentRoomData);
}
