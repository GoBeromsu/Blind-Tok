import {FastifyInstance} from "fastify";
import pages from "./pages";
import api from "./api";

export default async function (fastify: FastifyInstance) {
  fastify.register(pages, {prefix: "/"});
  fastify.register(api, {prefix: "/api/v1/"});
}
