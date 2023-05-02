import {FastifyInstance} from "fastify";
import user from "./User";

export default async function (fastify: FastifyInstance) {
  fastify.register(user, {prefix: "/user"});
}
