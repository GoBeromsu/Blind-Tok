import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {addUser, getUserInfo, getUsersInfo} from "@user/service/UserService";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await getUsersInfo();
    reply.send(users);
  });
  fastify.get("/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const userid = req.params.userid;
    const user = await getUserInfo(userid);
    reply.send(user);
  });
  fastify.post("/", async (req: FastifyRequest<{Body: {name: string; email: string}}>, reply: FastifyReply) => {
    const user = await addUser(req.body);
    reply.send(user);
  });
}
