import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {removeUser} from "@user/service/UserService";
import {addFriend, editFriend, getFriendInfo, getFriendsInfo, removeFriend} from "@user/service/UserRelationService";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const selected = await getFriendsInfo();
    reply.send(selected);
  });
  fastify.get("/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const userRelations = await getFriendInfo(userid);
    // console.log(userRelations);

    const friendIdList = userRelations.map(relation => (relation.userid === userid ? relation.friendid : relation.userid));
    reply.send(friendIdList);
  });
  fastify.get("/relation/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const userRelations = await getFriendInfo(userid);
    // console.log(userRelations);
    const relationList = userRelations.filter(relation => relation.userid === userid || relation.friendid === userid);
    reply.send(relationList);
  });
  fastify.post("/:userid/:friendid", async (req: FastifyRequest<{Params: {userid: number; friendid: number}}>, reply: FastifyReply) => {
    const {userid, friendid} = req.params;
    const selected = await addFriend({userid, friendid});
    reply.send(selected);
  });
  fastify.put("/:relationid", async (req: FastifyRequest<{Params: {relationid: number}; Body: {status: string}}>, reply: FastifyReply) => {
    const {relationid} = req.params;
    const result = await editFriend(relationid, req.body);
    reply.send(result);
  });
  fastify.delete("/:friendid", async (req: FastifyRequest<{Params: {userid: number; friendid: number}}>, reply: FastifyReply) => {
    console.log(req.params);
    const result = await removeFriend(req.params);
    reply.send(result);
  });
}
