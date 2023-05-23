import {getRoomData_name_user, roomAddUser, show_r} from "@utils/ChatRoomUtils";
import {show_u, userAddRoom} from "@utils/ChatUserUtils";
import {show_d} from "@utils/ChatDataUtils";

export var user_list: any = [];

export function userJoin(socket: any, list: any) {
  console.log("userJoin : ", list);
  for (let l = 0; l < list.length; l++) {
    socket.join(list[l].room_id);
  }
}

export function make_RoomListData(list: any) {
  return list.map((data: any) => getRoomData_name_user(data.room_id));
}

export function route_createRoom(io: any, data: any) {
  data.user_list.map((user: any) => {
    let tmp = user_list.find((socket: any) => socket.user_id === user.user_id);
    if (tmp) {
      io.to(tmp.socket.id).emit("rec_create_room", data);
      tmp.socket.join(data.room_id);
    }
  });
}

export function route(io: any, list: any, opt: string, data: any) {
  list.map((user: any) => {
    let tmp = user_list.find((socket: any) => socket.user_id === user.user_id);
    if (tmp) {
      io.to(tmp.socket.id).emit(opt, data);
    }
  });
}

export function add_user(io: any, data:any){
  if(!data.user_list)return;
  //if(!tmp.user_list?.find((user) => data.user.userid === user.user_id))return;
  data.user_list.map((user:any) => {
    roomAddUser(data.room_id, user.user_id);
    userAddRoom(data.room_id, user.user_id);
    user_list.find((socket:any)=>socket.user_id === user.user_id).socket.join(data.room_id);
  })
  let tmp = getRoomData_name_user(data.room_id);
  route(io,tmp.user_list,"rec_add_user", data);
  route(io,data.user_list,"rec_add_room", tmp);
  console.log("add_user");
}

// test
export function show() {
  show_d();
  show_r();
  show_u();
}
