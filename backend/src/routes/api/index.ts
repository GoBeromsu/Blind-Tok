import {FastifyInstance} from "fastify";
import user from "./User";
import music from "./File";

export default async function (fastify: FastifyInstance) {
  fastify.register(user, {prefix: "/user"});
  fastify.register(music, {prefix: "/file"});
}
