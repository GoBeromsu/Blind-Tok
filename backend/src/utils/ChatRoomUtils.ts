import {updateRoomList} from "@utils/ChatUserUtils";
import {createData, getData, setData} from "@utils/ChatDataUtils";

interface ChatRoomData {
  roomid: string;
  roomname: string;
  minnum: number;
  maxnum: number;
  userlist: user_l[];
}

interface user_l {
  userid: string;
  datanum: number;
}

var data: ChatRoomData[] = [];
var nextId: number = 1;

export function createRoom(userlist: any, roomname: string) {
  let roomid: string = "" + nextId;
  if (data.find(data => data.roomid === roomid)) {
    console.log("err(createRoom : roomid)");
    return;
  }
  let tmp: ChatRoomData[] = data;
  // 같은 인원을 가진 방은 만들지 않는다.
  for (let i = 0; i < userlist.length; i++) {
    tmp = tmp.filter(room => (room.userlist.find(user => user.userid === userlist[i].userid) ? true : false));
  }
  tmp = tmp.filter(room => room.userlist.length == userlist.length ? true : false);
  if (tmp.length > 0) return;

  let str: string = userlist[0].userid;
  if (roomname == "") {
    for (let i = 1; i < userlist.length; i++) {
      str += ", " + userlist[i].userid;
    }
  } else str = roomname;

  let data_n = {
    roomid: roomid,
    roomname: str,
    minnum: 0,
    maxnum: 0,
    userlist: userlist.map((user: user_l) => {
      return {userid: user.userid, datanum: 0};
    }),
  };
  data = [...data, data_n];
  console.log("RoomData : ");
  console.log(data);

  updateRoomList(roomid, userlist);
  createData(roomid);
  nextId = nextId + 1;
  console.log("success createRoom");
  return {roomid: data_n.roomid, roomname: data_n.roomname, userlist: data_n.userlist};
}

// 서버와 접속이 끊긴 동안의 채팅 내역을 가져오는 함수
export function checkData(roomid: string, userid: string) {
  let index: number = data.findIndex(data => data.roomid === roomid);
  let roomdata: ChatRoomData = data[index];
  console.log(data);
  if (!roomdata) roomdata = data[index];
  let data_n;
  let min = roomdata.minnum;
  let max = roomdata.maxnum;
  let userdata = roomdata.userlist.find((user: user_l) => user.userid === userid);
  if (typeof userdata === "undefined") {
    console.log("checkData : userid not Found");
    return;
  }
  if (max === userdata.datanum || !userdata) return 0; // 추가 내용 없음
  else if (min === userdata.datanum) {
    let min_Arr = roomdata.userlist.reduce((prev, value) => {
      return prev.datanum < value.datanum ? prev : value;
    });
    data[index].minnum = min_Arr.datanum;
    data_n = getData(roomid, min_Arr.datanum, 1);
    console.log(userdata);
  } else {
    data_n = getData(roomid, userdata.datanum, 0);
  }
  userdata.datanum = max;
  return data_n;
}

export function updateRoom(roomid: string, rest: any) {
  let index = data.findIndex(data => data.roomid === roomid);
  let num = data[index].maxnum + 1;
  data[index].maxnum = num;
  let index1 = data[index].userlist.findIndex(user => user.userid === rest.userid);
  data[index].userlist[index1].datanum = num;
  rest = {num: num, ...rest};
  setData(roomid, rest);
  return {roomid: roomid, ...rest};
}

export function removeUserList(roomid: string, userid: string) {
  let room = data.find(data => data.roomid === roomid);
  if (typeof room === "undefined") {
    console.log("reomveUserList : roomid not Found");
    return;
  }
  room.userlist = room.userlist.filter(user => user.userid != userid);
  data = data.map((data: any) => (data.roomid === roomid ? room : data));
}

export function getData_R() {
  return data;
}

export function setData_R(data_r: ChatRoomData[]) {
  data = data_r;
  nextId = data.length;
  console.log("nextId : " + nextId);
}

export function getRoomData_name_user(roomid: string) {
  let room = data.find(data => data.roomid === roomid);
  if (!room) return {};
  return {
    roomid: roomid,
    roomname: room.roomname,
    userlist: room.userlist.map(data => {
      return {userid: data.userid};
    }),
  };
}

export function roomAddUser(roomid:string, userid:string){
  let index:number = data.findIndex((data) => data.roomid === roomid);
  data[index].userlist.push({userid: userid, datanum: data[index].maxnum});
  console.log(data);
}

// test
export function show_r() {
  console.log("room_userList : ");
  console.log(data);
}
