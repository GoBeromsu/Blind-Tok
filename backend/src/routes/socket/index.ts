import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import {add_user, dataInit, leaveRoom, enteredMessage, getRooms, sendOfflineMessage} from "../../chat/ChatUserUtils";

import {createRoomAndNotify} from "../../chat/ChatRoomUtils";
import {joinVideoChat} from "src/chat/VideoUtils";
import {userRegistry} from "../../chat/Consonants";

export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    // console.log("User Connected: ", userRegistry.getAll());
    socket.on("dataInit", (userid: string) => {
      console.log("dataInit : ", userid, socket.id);
      dataInit(fastify.io, socket, userid);
      // console.log("called dataInit");
    });

    socket.on("leaveRoom", (data: {roomid: number; userid: string}) => {
      const {roomid, userid} = data;
      leaveRoom(fastify.io, socket, roomid, userid);
    });

    socket.on("joinVideoChat", (data: {roomid: number; userlist: any[]}) => {
      const {roomid, userlist} = data;
      console.log("joinVideoChat : ", roomid, userlist);
      joinVideoChat(roomid, userlist);
    });
    socket.on("getRooms", (data: any) => {
      getRooms(socket);
    });
    socket.on("getOfflineMessage", (data: any)=>{
      sendOfflineMessage(fastify.io, socket, data.roomid);
    })

    socket.on("disconnect", (reason: any) => {
      // TODO: 방을 나가는 것과 socket이 disconnect 되는 것은 다름
      // console.log("disconnect : ", userRegistry.getAll());
      // const user = userRegistry.getBySocket(socket);
      // if (user) {
      //   userRegistry.unregister(user.userid);
      // }
      // console.log("disconnect : ", reason, " / user : ", user?.userid);
    });

    socket.on("createRoom", (data: {user: any; userlist: any; roomname: string}) => {
      const {user, userlist, roomname} = data;
      createRoomAndNotify(fastify.io, data);
    });

    socket.on("addUser", (data: any) => {
      add_user(fastify.io, data);
    });

    socket.on("enteredMessage", (data: {roomid: number; userid: number; nickname: string; time: string; data_s: any}) => {
      enteredMessage(fastify.io, socket, data);
    });
  });
}
