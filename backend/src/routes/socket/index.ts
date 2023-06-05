import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import {register} from "./video";
import {add_user, dataInit, leaveRoom, processReceivedMessage, userRegistry} from "../../chat/ChatUserUtils";

import {createRoomAndNotify} from "../../chat/ChatRoomUtils";

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

    socket.on("joinVideoChat", (data: {roomid: number; userlist: any[]}) => {});

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
      processReceivedMessage(fastify.io, socket, data);
    });
  });
}
