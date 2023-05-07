import {FastifyInstance} from "fastify";
import {fastifyView} from "@fastify/view";
import ejs from "ejs";
import register from "./register";
export default async function (fastify: FastifyInstance) {
  register(fastify);
}
