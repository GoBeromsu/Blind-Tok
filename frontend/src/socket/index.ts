import {Socket, io} from "socket.io-client";
import {updateChat} from "@views/Chat/ChatRoom";
import {setList} from "@views/Chat/ChatList";
import {setChatList, addChat_list, subChat_list} from "@data/chat/chat_list";
import {updateChatData, updateData_s, subData} from "@data/chat/chat_data";
import {SOCKET_URL} from "../consonants";

const socket: Socket = io(SOCKET_URL);
socket.on("disconnect", reason => {
  console.log("socket : disconnect");
});

socket.on("message", (message: any) => {
  switch (message.id) {
    case "registered":
      console.log(message.data);
      break;
    default:
      console.log("Unrecognized message", message);
  }
});
socket.on("receive_message", (data: any) => {
  updateChat(updateChatData(data));
});

socket.on("update_roomList", (data: any) => {
  // Implement logic here
});

socket.on("rec_chatData", (data: any) => {
  if (data.data !== 0) {
    updateData_s(data);
  }
});

socket.on("rec_chatList", (data: any) => {
  setChatList(data);
  setList();
});

socket.on("rec_create_room", (data: any) => {
  console.log("rec_c");
  addChat_list(data);
  setList();
});

export function dataInit(user_id: string) {
  console.log(user_id);
  socket.emit("data_init", user_id);
}
export function createRoom(user: any, user_list: any[], room_name: string = "") {
  console.log("cccc");
  socket.emit("create_room", {user, user_list, room_name});
}

export function addUser(user_list: any) {
  socket.emit("add_user", user_list);
}

export function leaveRoom(room_id: string, user_id: string) {
  subChat_list(room_id, user_id);
  subData(room_id, user_id);
  setList();
  socket.emit("leave_room", room_id, user_id);
}

export function sendMessage(data: any) {
  console.log(data);
  socket.emit("message", data);
}

export function getChatList(user_id: string) {
  socket.emit("get_UserRoomList", user_id);
}
