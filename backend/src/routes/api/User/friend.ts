import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {removeUser} from "@user/service/UserService";
import {addFriend, editFriend, getFriendInfo, getFriendsInfo, removeFriend} from "@user/service/UserRelationService";

export default async function (fastify: FastifyInstance) {
  fastify.get("/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const selected = getFriendsInfo(userid);
    reply.send(selected);
  });
  fastify.post("/:userid/:friendid", async (req: FastifyRequest<{Params: {userid: number; friendid: number}}>, reply: FastifyReply) => {
    const {userid, friendid} = req.params;
    const selected = addFriend({userid, friendid});
    reply.send(selected);
  });
  fastify.get("/:userid/:friendid", async (req: FastifyRequest<{Params: {userid: number; friendid: number}}>, reply: FastifyReply) => {
    const {userid, friendid} = req.params;
    const selected = getFriendInfo(userid, friendid);
    reply.send(selected);
  });
  fastify.put("/:relationid", async (req: FastifyRequest<{Params: {relationid: number}; Body: {status: string}}>, reply: FastifyReply) => {
    const {relationid} = req.params;
    const result = editFriend(relationid, req.body);
    reply.send(result);
  });
  fastify.delete("/:friendid", async (req: FastifyRequest<{Params: {userid: number; friendid: number}}>, reply: FastifyReply) => {
    const result = removeFriend(req.params);
    reply.send(result);
  });
}
