import {getRoomData_name_user, show_r} from "@utils/ChatRoomUtils";
import {show_d} from "@utils/ChatDataUtils";
import {show_u} from "@utils/ChatUserUtils";

export var user_list: any = [];

export function userJoin(socket: any, list: any) {
  console.log(list);
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
    if (tmp) io.to(tmp.socket_id).emit("rec_create_room", data);
  });
}

// test
export function show() {
  show_d();
  show_r();
  show_u();
}
