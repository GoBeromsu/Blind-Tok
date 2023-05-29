import {getData, setData} from "@utils/ChatDataUtils";
import user from "../routes/api/User";
import {userlist} from "../routes/socket/chat";
interface ChatRoomData {
  roomid: number;
  roomname: string;
  minnum: number;
  maxnum: number;
  userlist: user_l[];
}

interface user_l {
  userid: string;
  datanum: number;
}

let chatRoomDatas: ChatRoomData[] = [];
let nextId: number = 1;

// 방생성 함수
// 방 아이디를 만들어 부여한다.
// 같은 유저리스트를 가진 방이 있다면 종료
// 방 이름이 없다는 가정하여 유저리스트의 아이디를 방의 이름으로 설정
// data 배열에 새로운 방(data_n)을 저장 및 반환 / 이는 방이 만들어졌다는 사실을 유저에게 전송할 때 사용됨.
export function createRoom(userlist: any, roomname: string) {
  let roomid: number = nextId;
  if (chatRoomDatas.find(data => data.roomid === roomid)) {
    console.log("err(createRoom : roomid)");
    return;
  }
  let check: ChatRoomData[] = chatRoomDatas;
  // 같은 인원을 가진 방은 만들지 않는다.
  for (let i = 0; i < userlist.length; i++) {
    check = check.filter(room => (room.userlist.find(user => user.userid === userlist[i].userid) ? true : false));
  }
  check = check.filter(room => (room.userlist.length == userlist.length ? true : false));
  if (check.length > 0) return;

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
  console.log("data_n : ", data_n);
  chatRoomDatas = [...chatRoomDatas, data_n];
  console.log("RoomData : ", chatRoomDatas);
  nextId = nextId + 1;
  console.log("success createRoom");
  return {roomid: data_n.roomid, roomname: data_n.roomname, userlist: data_n.userlist};
}

// 서버와 접속이 끊긴 동안의 채팅 내역을 가져오는 함수
export function checkData(roomid: number, userid: string) {
  // 해당 방을 찾을 찾고 방의 데이터를 가져온다.
  let index: number = chatRoomDatas.findIndex(data => data.roomid === roomid);
  let roomdata: ChatRoomData = chatRoomDatas[index];
  console.log(chatRoomDatas);
  if (!roomdata) roomdata = chatRoomDatas[index];
  let data_n;
  let min = roomdata.minnum;
  let max = roomdata.maxnum;
  // 해당 방에서 해당 유저의 데이터를 가져온다.
  let userdata = roomdata.userlist.find((user: user_l) => user.userid === userid);
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
    chatRoomDatas[index].minnum = min_Arr.datanum;
    data_n = getData(roomid, min_Arr.datanum, 1);
    console.log(userdata);
    // 만일 max와 min 사이의 값이라면 유저의 datanum에서 부터 max까지의 데이터를 가져온다. 이때 저장된 데이터는 삭제하지 않는다.
    // 이는 옵션 0을 통해 구별 가능하다.
  } else {
    data_n = getData(roomid, userdata.datanum, 0);
    console.log(userdata);
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
export function updateRoom(roomid: number, rest: any, list: any) {
  let index = chatRoomDatas.findIndex(data => data.roomid == roomid); //room id로 방 찾기
  console.log("updateRoom : ", index, rest);
  if (index == -1) return;
  let num = chatRoomDatas[index].maxnum + 1;
  chatRoomDatas[index].maxnum = num;
  let userlist: user_l[] = [];
  chatRoomDatas[index].userlist.map((data: any) => {
    !list.find((user: any) => user.userid === data.userid) ? userlist.push(data) : userlist.push({userid: data.userid, datanum: num});
  });
  chatRoomDatas[index].userlist = userlist;
  console.log(userlist);
  rest = {num: num, ...rest};
  setData(roomid, rest);
  return {roomid: roomid, ...rest};
}

// 방 나가기 시 실행되는 함수
// 해당 방을 찾고 userlist에서 해당 userid를 제거한다.
export function removeUserList(roomid: number, userid: string) {
  let room = chatRoomDatas.find(data => data.roomid === roomid);
  if (typeof room === "undefined") {
    console.log("reomveUserList : roomid not Found");
    return;
  }
  room.userlist = room.userlist.filter(user => user.userid != userid);
  chatRoomDatas = chatRoomDatas.map((data: any) => (data.roomid === roomid ? room : data));
}

// 해당 방의 정보를 가져오는데, 필요없는 minnum과 maxnum, userlist의 num을 제외하고 반환한다.
export function getRoomData_name_user(roomid: number) {
  let room = chatRoomDatas.find(data => data.roomid === roomid);
  if (!room) return {};
  console.log("getRoomData의 userList 호출 됨 :", userlist);
  return {
    roomid: roomid,
    roomname: room.roomname,

    userlist: room.userlist.map((userid: any) => ({
      userid: userid,
    })),
    // userlist: room.userlist.map(data => {
    //   return {userid: data.userid};
    // })
  };
}

// 해당 방을 찾아 유저리스트에 해당 유저를 추가하는 함수
export function roomAddUser(roomid: number, userid: string) {
  let index: number = chatRoomDatas.findIndex(data => data.roomid === roomid);
  chatRoomDatas[index].userlist.push({userid: userid, datanum: chatRoomDatas[index].maxnum});
  console.log(chatRoomDatas);
}

// test
export function show_r() {
  console.log("room_userList : ");
  console.log(chatRoomDatas);
}
