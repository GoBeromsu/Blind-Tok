import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {message, disconnect, create_room, leave_room, data_init, add_user} from "./chat";
import {register} from "./video";

export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("data_init", (userid: string) => {
      data_init(fastify.io, socket, userid);
      console.log("data_init");
    });

    socket.on("leave_room", (roomid: string) => {
      leave_room(fastify.io, socket, roomid);
      console.log("leave_roo");
    });

    socket.on("disconnect", (reason: any) => {
      disconnect(socket);
      console.log("disconnec");
    });

    socket.on("create_room", (data: any) => {
      create_room(fastify.io, data);
      console.log("create_room");
    });

    socket.on("add_user", (data: any) => {
      add_user(fastify.io, data);
      console.log("add_user");
    });

    socket.on("message", (datas: any) => {
      message(fastify.io, socket, datas);
      console.log("message");
    });

    socket.on("message", (message: any) => {
      console.log(`Connection: ${socket.id} receive message: ${message.id}`);

      switch (message.id) {
        case "register":
          console.log(`Server: Register ${socket.id}`);
          register(socket, message?.name || "", () => {});
          break;
        case "joinRoom":
          console.log(`Server: ${socket.id} joinRoom: ${message.roomName}`);
          // joinRoom(socket, message.roomName || "", () => {});
          break;
        // case "receiveVideoFrom":
        //   console.log(`${socket.id} receiveVideoFrom: ${message.sender}`);
        //   receiveVideoFrom(socket, message.sender || "", message.sdpOffer || "", () => {});
        //   break;
        // case "leaveRoom":
        //   console.log(`${socket.id} leaveRoom`);
        //   leaveRoom(socket.id);
        //   break;
        // case "onIceCandidate":
        //   addIceCandidate(socket, message);
        //   break;
        // default:
        //   socket.emit("error", {id: "error", message: `Invalid message ${message}`});
      }
    });
  });
}
