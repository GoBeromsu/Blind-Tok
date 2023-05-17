import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    console.log("socket connected");

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });
}
