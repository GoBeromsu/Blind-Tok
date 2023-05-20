import {Socket, io} from "socket.io-client";
import {updateChat} from "@views/Chat/ChatRoom";
import {setList} from "@views/Chat/ChatList";
import {addChat_list, setChatList} from "@data/Chat/chat_list";
import {updateChatData, updateData_s} from "@data/Chat/chat_data";

var socket: Socket = io("");

export function createSocket(add: string = "", user: any) {
  if (!user) {
    return;
  }

  socket = add === "" ? io("http://localhost:4001") : io(add);

  socket.on("disconnect", reason => {
    socket = io("");
    console.log("socket : disconnect");
  });

  socket.on("receive_message", (data: any) => {
    console.log(data);
    updateChat(updateChatData(data));
  });

  socket.on("update_roomList", (data: any) => {
    // Implement logic here
  });

  socket.on("rec_chatData", (data: any) => {
    if (data.data !== 0) {
      updateData_s(data);
      console.log(data);
    }
  });

  socket.on("rec_chatList", (data: any) => {
    setChatList(data);
    setList();
  });

  socket.on("rec_create_room", (data: any) => {
    addChat_list(data);
    setList();
  });

  socket.emit("data_init", user.userid);
  console.log(user.userid);
  console.log(socket);
}

export function getSocket(): Socket {
  return socket;
}

export function createRoom(user: any, user_list: any[], room_name: string = "") {
  socket.emit("create_room", {user, user_list, room_name});
}

export function addUser(user_id: string) {
  socket.emit("add_user", {user_id});
}

export function sendMessage(data: any) {
  socket.emit("send_message", {message: data});
  socket.emit("show_data"); // test
}

export function getChatList(user_id: string) {
  socket.emit("get_UserRoomList", user_id);
}

export function leaveRoom() {
  socket.emit("leave_room");
}