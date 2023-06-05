import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import {add_user, dataInit, leaveRoom, enteredMessage} from "../../chat/ChatUserUtils";

import {createRoomAndNotify} from "../../chat/ChatRoomUtils";
import {joinVideoChat} from "src/chat/VideoUtils";
import {userRegistry} from "../../chat/Consonants";

export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    // console.log(`User Connected: ${socket.userid}`);

    socket.on("dataInit", (userid: string) => {
      dataInit(fastify.io, socket, userid);
    });

    socket.on("leaveRoom", (data: {roomid: number; userid: string}) => {
      const {roomid, userid} = data;
      leaveRoom(fastify.io, socket, roomid, userid);
    });

    socket.on("joinVideoChat", (data: {roomid: number; userlist: any[]}) => {
      joinVideoChat();
    });

    socket.on("disconnect", (reason: any) => {
      const user = userRegistry.getBySocket(socket);
      if (user) {
        userRegistry.unregister(user.userid);
      }
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
