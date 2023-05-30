import {Socket, io} from "socket.io-client";

import {SOCKET_URL} from "../consonants";
import {recMessage} from "@utils/ChattingController";

const socket: Socket = io(SOCKET_URL);
socket.on("disconnect", reason => {
  console.log("socket : disconnect");
});

socket.on("rec_message", (message: any) => {
  recMessage(message);
});

// socket.on("processReceivedMessage", (processReceivedMessage: any) => {
//   switch (processReceivedMessage.id) {
//     case "registered":
//       console.log(processReceivedMessage.data);
//       break;
//     default:
//       console.log("Unrecognized processReceivedMessage", processReceivedMessage);
//   }
// });

export function dataInit(userid: string) {
  console.log("data init called user : ", userid);
  socket.emit("data_init", userid);
}

export function sendMessage(data: any, opt: string) {
  console.log("sendMessage : ", data);
  socket.emit(opt, data);
}
