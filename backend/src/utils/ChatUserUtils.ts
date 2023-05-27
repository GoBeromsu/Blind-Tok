interface ChatUserData {
  userid: string;
  roomlist: room_l[];
}
interface room_l {
  roomid: string;
}

var data: ChatUserData[] = [];

export function newUser(userid: string) {
  let data_n = {
    userid: userid,
    roomlist: new Array(),
  };
  data = [...data, data_n];
}

export function updateRoomList(roomid: string, userList: any) {
  if (!userList) return;
  console.log(userList);

  for (let i = 0; i < userList.length; i++) {
    let index = data.findIndex(user => user.userid === userList[i].userid);
    if (index == -1) {
      newUser(userList[i].userid);
      index = data.length - 1;
    }
    let tmp = data[index];
    data[index] = {userid: tmp.userid, roomlist: [{roomid: roomid}, ...tmp.roomlist]};

    console.log("updateRoomList : ");
    console.log(data);
  }
}

export function removeRoomList(roomid: string, userid: string) {
  if (!Array.isArray(data)) {
    console.error("Data is undefined or not an array");
    return;
  }
  let user = data.find(data => {
    data.userid === userid;
  });
  if (typeof user === "undefined") return;
  user.roomlist = user.roomlist.filter(room => room.roomid != roomid);
  data = data.map((data: any) => (data.userid === userid ? user : data));
  console.log("removeRoomList : ");
  console.log(data);
}

export function getUserRoomList(userid: string) {
  if (!Array.isArray(data)) {
    console.error("Data is undefined or not an array");
    return [];
  }
  let user = data.find(data => data.userid === userid);
  if (!user) {
    newUser(userid);
    return [];
  }
  return user.roomlist;
}

export function userAddRoom(roomid:string, userid:string){
  let index = data.findIndex((data)=> data.userid === userid);
  if(index == -1) {
    newUser(userid)
    index = data.length-1;
  };
  data[index].roomlist.push({roomid : roomid});
  console.log(data[index]);
}

export function getData_U() {
  return data;
}
export function setData_U(data_r: ChatUserData[]) {
  data = data_r;
}

// test
export function show_u() {
  console.log("user_roomList : ");
  console.log(data);
}
