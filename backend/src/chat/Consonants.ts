import UserRegistry from "./UserRegistry";

export interface ChatRoomData {
  roomid: number;
  roomname: string;
  minnum: number;
  maxnum: number;
  userlist: {userid: string; datanum: number}[];
}

export let rooms: {[roomid: number]: ChatRoomData} = {};
export let userRegistry = new UserRegistry();
