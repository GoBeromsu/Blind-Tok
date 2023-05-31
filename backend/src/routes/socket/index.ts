import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {processReceivedMessage, disconnect, create_room, leave_room, data_init, add_user} from "./chat";
import {register} from "./video";

export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    // console.log(`User Connected: ${socket.id}`);

    socket.on("data_init", (userid: string) => {
      data_init(fastify.io, socket, userid);
    });

    socket.on("leave_room", (roomid: number) => {
      leave_room(fastify.io, socket, roomid);
    });

    socket.on("disconnect", (reason: any) => {
      disconnect(socket);
    });

    socket.on("create_room", (data: {user: any; userlist: any; roomname: string}) => {
      console.log("create_room", data);
      create_room(fastify.io, data);
    });

    socket.on("add_user", (data: any) => {
      add_user(fastify.io, data);
    });
    socket.on("enteredMessage", (data: {roomid: number; userid: number; nickname: string; time: string; data_s: any}) => {
      processReceivedMessage(fastify.io, socket, data);
    });
  });
}
