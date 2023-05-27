import {getRoomData_name_user, roomAddUser, show_r} from "@utils/ChatRoomUtils";
import {show_u, userAddRoom} from "@utils/ChatUserUtils";
import {show_d} from "@utils/ChatDataUtils";

export var userlist: any = [];

export function userJoin(socket: any, list: any) {
  console.log("userJoin : ", list);
  for (let l = 0; l < list.length; l++) {
    socket.join(list[l].roomid);
  }
}

export function make_RoomListData(list: any) {
  return list.map((data: any) => getRoomData_name_user(data.roomid));
}

export function route_createRoom(io: any, data: any) {
  data.userlist.map((user: any) => {
    let tmp = userlist.find((socket: any) => socket.userid === user.userid);
    if (tmp) {
      io.to(tmp.socket.id).emit("rec_message", {data: data, id:"rec_createRoom"});
      tmp.socket.join(data.roomid);
    }
  });
}

export function route(io: any, list: any, opt: string, data: any) {
  list.map((user: any) => {
    let tmp = userlist.find((socket: any) => socket.userid === user.userid);
    if (tmp) {
      io.to(tmp.socket.id).emit("rec_message",{data: data, id: opt});
    }
  });
}

export function add_user(io: any, data:any){
  if(!data.userlist)return;
  //if(!tmp.user_list?.find((user) => data.user.userid === user.user_id))return;
  data.userlist.map((user:any) => {
    roomAddUser(data.roomid, user.userid);
    userAddRoom(data.roomid, user.userid);
    userlist.find((socket:any)=>socket.userid === user.userid).socket.join(data.roomid);
  })
  let tmp = getRoomData_name_user(data.roomid);
  route(io,tmp.userlist,"rec_addUser", data);
  route(io,data.userlist,"rec_addRoom", tmp);
  console.log("add_user");
}

// test
export function show() {
  show_d();
  show_r();
  show_u();
}
