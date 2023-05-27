import {Socket, io} from "socket.io-client";
import {updateChat} from "@views/Chat/ChatRoom";
import {setList} from "@views/Chat/ChatList";
import {setChatList, addChat_list, removeChat_list, subUserChat_list} from "@data/chat/chat_list";
import {updateChatData, updateData_s, subData} from "@data/chat/chat_data";
import {SOCKET_URL} from "../consonants";
import {recMessage} from "@utils/ChattingController";

const socket: Socket = io(SOCKET_URL);
socket.on("disconnect", reason => {
  console.log("socket : disconnect");
});

socket.on("rec_message", (message: any) => {
  recMessage(message);
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

export function dataInit(userid: string) {
  console.log("data init called user : ", userid);
  socket.emit("data_init", userid);
}

export function sendMessage(data: any, opt:string) {
  console.log(data);
  socket.emit(opt, data);
}
