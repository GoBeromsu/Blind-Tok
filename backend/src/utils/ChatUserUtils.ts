interface ChatUserData {
  user_id: string;
  room_list: room_l[];
}
interface room_l {
  room_id: string;
}

let data: ChatUserData[];

export function newUser(user_id: string) {
  let data_n = {
    user_id: user_id,
    room_list: [],
  };
  data = [...data, data_n];
}

export function updateRoomList(room_id: string, userList: any) {
  if (!userList) return;
  console.log(userList);

  for (let i = 0; i < userList.length; i++) {
    let index = data.findIndex(user => user.user_id === userList[i].user_id);
    if (index == -1) {
      newUser(userList[i].user_id);
      index = data.length - 1;
    }
    let tmp = data[index];
    data[index] = {user_id: tmp.user_id, room_list: [{room_id: room_id}, ...tmp.room_list]};

    console.log("updateRoomList : ");
    console.log(data);
  }
}

export function removeRoomList(room_id: string, user_id: string) {
  if (!Array.isArray(data)) {
    console.error("Data is undefined or not an array");
    return;
  }
  let user = data.find(data => {
    data.user_id === user_id;
  });
  if (typeof user === "undefined") return;
  user.room_list = user.room_list.filter(room => room.room_id != room_id);
  //data = data.map(data => (data.user_id === user_id ? user : data));
  console.log("removeRoomList : ");
  console.log(data);
}

export function getUserRoomList(user_id: string) {
  if (!Array.isArray(data)) {
    console.error("Data is undefined or not an array");
    return [];
  }
  let user = data.find(data => data.user_id === user_id);
  if (!user) {
    newUser(user_id);
    return [];
  }
  return user.room_list;
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
