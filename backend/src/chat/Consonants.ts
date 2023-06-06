import UserRegistry from "./UserRegistry";

export interface ChatRoomData {
  roomid: number;
  roomname: string;
  minnum: number;
  maxnum: number;
  userlist: {userid: string; datanum: number; offlineData: any[]}[];
  pipeline: any;
  kurentoClient: any;
  participants: any;
}

export let rooms: {[roomid: number]: ChatRoomData} = {};
export let userRegistry = new UserRegistry();

export function getOfflineData(roomid: number, index: number) {
  let data = rooms[roomid]?.userlist[index]?.offlineData;
  rooms[roomid].userlist[index].offlineData = [];
  return data;
}

export function sendMessage(socket: any, message: any) {
  console.log("sendMessage : ", message);
  socket.emit("message", message);
}
