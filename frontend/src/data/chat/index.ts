import {Socket, io} from "socket.io-client";

import {SOCKET_URL} from "../../consonants";
export const socket: Socket = io(SOCKET_URL);
socket.on("disconnect", reason => {
  console.log("socket : disconnect");
});

export function sendMessage(data: any, opt: string) {
  console.log("sendMessage : ", data, ", 옵션 : ", opt);
  socket.emit(opt, data);
}
