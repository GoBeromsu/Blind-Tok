import {createData, getData, setData} from "./ChatDataUtils";
import {notifyUsersConnect, updateRoomList} from "./ChatUserUtils";
import {ChatRoomData, rooms, userRegistry} from "./Consonants";

let nextId: number = 1;
export function findRoom(roomid: number) {
  let room = rooms[roomid];
  if (!room) {
    console.log("Room ID not found: ", roomid);
    return null;
  }
  return room;
}

// 서버와 접속이 끊긴 동안의 채팅 내역을 가져오는 함수
export function checkData(roomid: number, userid: string) {
  // 해당 방을 찾을 찾고 방의 데이터를 가져온다.

  const roomdata = findRoom(roomid);
  if (!roomdata) return;
  let data_n;
  let min = roomdata?.minnum;
  let max = roomdata?.maxnum;

  // 해당 방에서 해당 유저의 데이터를 가져온다.
  let userdata = roomdata?.userlist.find((user: {userid: string; datanum: number}) => user.userid === userid);
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
    rooms[roomid].minnum = min_Arr.datanum;
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

export function updateRoom(roomid: number, rest: any) {
  let room = findRoom(roomid);
  if (!room) return;
  room.maxnum += 1;
  room.userlist.forEach((data: any) => {
    let userSession = userRegistry.getById(data.userid);
    if (!userSession) return;
    data.datanum = room?.maxnum;
  });
  const updateRoom: ChatRoomData = {...room, ...rest};
  rest = {num: room.maxnum, ...rest};
  setData(roomid, rest);
  return updateRoom;
}

// 방 나가기 시 실행되는 함수
// 해당 방을 찾고 userlist에서 해당 userid를 제거한다.
export function removeUserList(roomid: number, userid: string) {
  let room = findRoom(roomid);
  if (!room) {
    console.log("removeUserList : roomid not Found");
    return;
  }
  room.userlist = room?.userlist.filter(user => user.userid != userid);
  rooms[roomid] = room;
}

// 해당 방의 정보를 가져오는데, 필요없는 minnum과 maxnum, userlist의 num을 제외하고 반환한다.
// export function findRoom(roomid: number) {
//   let room = findRoom(roomid);
//   if (!room) return {};
//   return room;
// }

export function addRoomUser(roomid: number, userid: string) {
  let room = findRoom(roomid);
  if (!room) return; // 존재하지 않는 방에 유저를 추가하려는 경우 처리
  room.userlist.push({userid: userid, datanum: room.maxnum});
}

//TODO: 현재 로직으로는 User들이 방에 들어올 때 모두 Socket을 가지고 있는 것이 자명함,
// TODO: 하지만, 추후에는 Socket을 가지고 있지 않은 User가 들어올 수도 있도록 변경하자, 왜냐면 로그아웃 된 상태의 User는 소켓이 없잖아
export function createRoomAndNotify(io: any, data: {user: any; userlist: any; roomname: string}) {
  const {user, userlist, roomname} = data;
  // let updatedUserList = [{userid: user.userid, nickname: user.nickname}, ...userlist];
  let updatedUserList = [user?.userid, ...userlist];
  // console.log("updatedUserList : ", updatedUserList);
  let createdRoom = createRoom(updatedUserList, roomname);
  // console.log("created Room : ", createdRoom);
  if (createdRoom) {
    updateRoomList(createdRoom.roomid, updatedUserList);
    createData(createdRoom.roomid);
    notifyUsersConnect(io, createdRoom);
  }
  // console.log("Socket 좀 보자~ ", userRegistry.getAll());
}
// 방생성 함수
// data 배열에 새로운 방(data_n)을 저장 및 반환 / 이는 방이 만들어졌다는 사실을 유저에게 전송할 때 사용됨.
export function createRoom(userlist: any, roomname: string): ChatRoomData | null {
  let roomid: number = nextId;

  let filteredRooms: ChatRoomData[] = Object.values(rooms).filter(room => {
    const foundUsers = userlist.filter((userid: any) => room?.userlist.some(u => u.userid === userid));
    return foundUsers.length === userlist.length && foundUsers.length === room.userlist.length;
  });

  if (filteredRooms.length > 0) return null;

  let roomName: string = userlist.map((userid: {datenum: number; userid: string}) => userid).join(", ");

  let newRoom: ChatRoomData = {
    roomid: roomid,
    roomname: roomName,
    minnum: 0,
    maxnum: 0,
    userlist: userlist,
  };

  rooms[roomid] = newRoom;
  nextId += 1;
  console.log("createRoom : ", newRoom);
  return newRoom;
}
