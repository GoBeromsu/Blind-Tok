import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import {register} from "./video";
import {add_user, data_init, leave_room, processReceivedMessage, userRegistry} from "../../chat/ChatUserUtils";

import {createRoomAndNotify} from "../../chat/ChatRoomUtils";

export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    // console.log(`User Connected: ${socket.userid}`);

    socket.on("data_init", (userid: string) => {
      data_init(fastify.io, socket, userid);
    });

    socket.on("leave_room", (data: {roomid: number; userid: string}) => {
      const {roomid, userid} = data;
      leave_room(fastify.io, socket, roomid, userid);
    });

    socket.on("disconnect", (reason: any) => {
      const user = userRegistry.getBySocket(socket);
      if (user) {
        userRegistry.unregister(user.userid);
      }
    });

    socket.on("createRoom", (data: {user: any; userlist: any; roomname: string}) => {
      const {user, userlist, roomname} = data;
      console.log("create_room", user?.userid, userlist, roomname);
      createRoomAndNotify(fastify.io, data);
    });

    socket.on("add_user", (data: any) => {
      add_user(fastify.io, data);
    });
    socket.on("enteredMessage", (data: {roomid: number; userid: number; nickname: string; time: string; data_s: any}) => {
      processReceivedMessage(fastify.io, socket, data);
    });
  });
}
