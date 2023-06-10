import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {getUserInfo, removeUser} from "@user/service/UserService";
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

    // const friendIdList = userRelations.map(relation => (relation.userid === userid ? relation.friendid : relation.userid));
    reply.send(userRelations);
  });
  fastify.post("/:userid/:friendid", async (req: FastifyRequest<{Params: {userid: number; friendid: number}}>, reply: FastifyReply) => {
    const {userid, friendid} = req.params;
    const selected = await addFriend({userid, friendid, status: "wait"});
    reply.send(selected);
  });
  fastify.put("/:relationid", async (req: FastifyRequest<{Params: {relationid: number}; Body: {status: string}}>, reply: FastifyReply) => {
    const {relationid} = req.params;
    const result = await editFriend(relationid, req.body);
    reply.send(result);
  });
  // 수정함
  // 삭제를 friendid 보다 relationid가 더 편할것으로 예상
  // 그에 따라 removeFriend도 수정함
  fastify.delete("/:relationid", async (req: FastifyRequest<{Params: {relationid: number}}>, reply: FastifyReply) => {
    const result = await removeFriend(req.params);
    reply.send(result);
  });

  fastify.get("/relation/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const userRelations = await getFriendInfo(userid);

    const friendIdList = userRelations
      .filter(relation => relation.friendid !== userid)
      .map(relation => {
        return {friendId: relation.friendid, status: relation.status, relationId: relation.relationid};
      });

    const resultPromises = friendIdList.map(async friend => {
      const userInfo = await getUserInfo(friend?.friendId);
      return {friendId: friend?.friendId, friendName: userInfo?.name, status: friend?.status, relationId: friend?.relationId};
    });

    const result = await Promise.all(resultPromises);

    reply.send(result);
  });
  // 보내면 userid friendid 관계로 하나가 생성
  // 하지만 반대의 경우는 생성되지 않음
  // 따라서 수락을 누를 경우 생성을 하는 것으로 결정
  // 그에 따라 생성 되었을 때 normal 상태여야 되는데 그렇게 만드는 방벙을 잘 모르겠어서
  // addFriend 수정했음
  // params에 status 추가해서 위의 addFriend부분이랑 합쳐도 될것 같기는 함
  // 하지만 확실하지 않아서 그냥 따로 만들었음
  fastify.post("/relation/:userid/:friendid", async (req: FastifyRequest<{Params: {userid: number; friendid: number}}>, reply: FastifyReply) => {
    const {userid, friendid} = req.params;
    const selected = await addFriend({userid, friendid, status: "normal"});
    reply.send(selected);
  });
}
