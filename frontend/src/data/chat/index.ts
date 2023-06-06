import {Socket, io} from "socket.io-client";

import {SOCKET_URL} from "../../consonants";
import {updateChat} from "@views/Chat/ChatRoom";
import {updateChatData, updateData_s} from "@data/chat/chat_data";
import {setList} from "@views/Chat/ChatList";
import {addChatList, setChatList, setListMessage} from "@data/chat/chat_list";

export const socket: Socket = io(SOCKET_URL);
socket.on("disconnect", reason => {
  console.log("socket : disconnect");
});

export function sendMessage(data: any, opt: string) {
  console.log("sendMessage : ", data, ", 옵션 : ", opt);
  socket.emit(opt, data);
}
