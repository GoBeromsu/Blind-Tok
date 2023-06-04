import {getData, setData} from "./ChatDataUtils";
import user from "../routes/api/User";
import {userRegistry} from "./ChatUserUtils";

interface ChatRoomData {
  roomid: number;
  roomname: string;
  minnum: number;
  maxnum: number;
  userlist: {userid: string; datanum: number}[];
}

let chatRoomDatas: {[roomid: number]: ChatRoomData} = {};
let nextId: number = 1;

// 방생성 함수
// data 배열에 새로운 방(data_n)을 저장 및 반환 / 이는 방이 만들어졌다는 사실을 유저에게 전송할 때 사용됨.
export function createRoom(userlist: any, roomname: string) {
  let roomid: number = nextId;
  // if (chatRoomDatas.find(data => data.roomid === roomid)) {
  if (chatRoomDatas[roomid]) {
    console.log("Error: createRoom - Room ID already exists");
    return;
  }
  // filterRooms는 userlist에 있는 유저들이 모두 있는 방을 찾는다.
  let filteredRooms: ChatRoomData[] = Object.values(chatRoomDatas).filter(room => {
    const foundUsers = userlist.filter((user: any) => room?.userlist.some(u => u.userid === user.userid));
    return foundUsers.length === userlist.length && foundUsers.length === room.userlist.length;
  });

  if (filteredRooms.length > 0) return;

  let roomName: string = userlist.map((user: {datenum: number; userid: string}) => user.userid).join(", ");

  let newRoom = {
    roomid: roomid,
    roomname: roomName,
    minnum: 0,
    maxnum: 0,
    userlist: userlist,
  };
  chatRoomDatas[roomid] = newRoom;
  nextId = nextId + 1;
  return {roomid: newRoom.roomid, roomname: newRoom.roomname, userlist: newRoom.userlist};
}

// 서버와 접속이 끊긴 동안의 채팅 내역을 가져오는 함수
export function checkData(roomid: number, userid: string) {
  // 해당 방을 찾을 찾고 방의 데이터를 가져온다.
  let roomdata: ChatRoomData = chatRoomDatas[roomid];
  if (!roomdata) {
    console.log("checkData : roomid not Found");
    return;
  }

  let data_n;
  let min = roomdata.minnum;
  let max = roomdata.maxnum;

  // 해당 방에서 해당 유저의 데이터를 가져온다.
  let userdata = roomdata.userlist.find((user: {userid: string; datanum: number}) => user.userid === userid);
  if (typeof userdata === "undefined") {
    console.log("checkData : userid not Found");
    return;
  }

  // 만일 유저의 정보가 없거나 유저의 datanum이 max와 같으면 종료
  if (max === userdata.datanum || !userdata) return 0; // 추가 내용 없음
  // 그렇지 않고 min과 동일하다면 방에 해당하는 데이터를 전부 가져오고
  // 다음 minnum을 찾고 그 다음 minnum까지 데이터를 삭제해준다. / 이는 minnum과 다음 minnum 사이의 데이터를 가지지 않은 인원이
  // 해당 유저뿐이기 때문이다. 따라서 더이상 그 데이터를 저장해놓을 필요가 없다.
  else if (min === userdata.datanum) {
    let min_Arr = roomdata.userlist.reduce((prev, value) => {
      return prev.datanum < value.datanum ? prev : value;
    });
    chatRoomDatas[roomid].minnum = min_Arr.datanum;
    data_n = getData(roomid, min_Arr.datanum, 1);

    // 만일 max와 min 사이의 값이라면 유저의 datanum에서 부터 max까지의 데이터를 가져온다. 이때 저장된 데이터는 삭제하지 않는다.
    // 이는 옵션 0을 통해 구별 가능하다.
  } else {
    data_n = getData(roomid, userdata.datanum, 0);
  }

  // 그 후 데이터를 가져간 해당 유저의 datanum을 max로 바꿔준다.
  userdata.datanum = max;
  // 가져온 데이터 반환
  return data_n;
}

// 데이터를 받았을 때 이를 처리하는 함수
// 해당 방의 인덱스를 찾아내고 maxnum을 1증가시킨다.
// 이 메시지를 받는 인원의 datanum이 num이 되어야되기 때문에 이를 map과 find를 통해
// 리스트에 있으면 datanum 에 num을 넣고 아니면 기존의 data를 사용한다.
// list에 있다는 것은 현재 접속 중이며 메시지를 받는다는 의미이다.
// 그 후 메시지와 roomid를 합쳐서 반환한다.
export function incrementMaxNum(room: any) {
  return (room.maxnum += 1);
}

export function updateUserList(room: any, num: number) {
  room.userlist.forEach((data: any) => {
    let userSession = userRegistry.getById(data.userid);
    if (!userSession) return;
    data.datanum = num;
  });
}
export function updateRoom(roomid: number, rest: any) {
  let room = chatRoomDatas[roomid];
  if (!room) return;

  let num = incrementMaxNum(room);
  updateUserList(room, num);
  rest = {num, ...rest};
  setData(roomid, rest);

  return {roomid, ...rest};
}

// 방 나가기 시 실행되는 함수
// 해당 방을 찾고 userlist에서 해당 userid를 제거한다.
export function removeUserList(roomid: number, userid: string) {
  let room = chatRoomDatas[roomid];
  if (!room) {
    console.log("removeUserList : roomid not Found");
    return;
  }
  room.userlist = room.userlist.filter(user => user.userid != userid);
  chatRoomDatas[roomid] = room;
}

// 해당 방의 정보를 가져오는데, 필요없는 minnum과 maxnum, userlist의 num을 제외하고 반환한다.
export function getRoomData(roomid: number) {
  let room = chatRoomDatas[roomid];
  if (!room) return {};

  return {
    roomid: roomid,
    roomname: room.roomname,
    userlist: room.userlist,
  };
}

export function addRoomUser(roomid: number, userid: string) {
  let room = chatRoomDatas[roomid];
  if (!room) return; // 존재하지 않는 방에 유저를 추가하려는 경우 처리
  room.userlist.push({userid: userid, datanum: room.maxnum});
}
