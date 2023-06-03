import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {addUser, editUser, getUserInfo, getUsersInfo, removeUser} from "@user/service/UserService";
import {txProcess} from "@lib/db";
import friend from "./friend";

import {editProfileMessage} from "@user/service/UserMetaService";

export default async function (fastify: FastifyInstance) {
  fastify.register(friend, {prefix: "/friend"});
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await getUsersInfo();
    reply.send(users);
  });
  fastify.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: {name: string; email: string; ssoid: string; type: string};
      }>,
      reply: FastifyReply,
    ) => {
      const user = await addUser(req.body);
      reply.send(user);
    },
  );

  fastify.get("/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const userid = req.params.userid;
    const user = await getUserInfo(userid);
    reply.send(user);
  });
  fastify.put(
    "/:userid",
    async (
      req: FastifyRequest<{
        Params: {userid: number};
        Body: {name: string; nickname: string; profilemesage: string; profilepictureurl: string; email: string};
      }>,
      reply: FastifyReply,
    ) => {
      const {userid} = req.params;
      const selected = await editUser(userid, req.body);
      reply.send(selected);
    },
  );
  fastify.put(
    "/:userid/profileMessage",
    async (req: FastifyRequest<{Params: {userid: number}; Body: {profileMessage: string}}>, reply: FastifyReply) => {
      const {userid} = req.params;
      const {profileMessage} = req.body;
      return await editProfileMessage(userid, profileMessage);
    },
  );
  fastify.put(
    "/:userid/profilePicturUrl",
    async (req: FastifyRequest<{Params: {userid: number}; Body: {profileMessage: string}}>, reply: FastifyReply) => {
      const {userid} = req.params;
      const {profileMessage} = req.body;
      return await editProfileMessage(userid, profileMessage);
    },
  );
}
