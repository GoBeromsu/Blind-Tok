import {FastifyInstance} from "fastify";
import {fastifyView} from "@fastify/view";
import ejs from "ejs";
import register from "./register";
import lifecycle from "./lifecycle";
export default async function (fastify: FastifyInstance) {
  register(fastify);
  lifecycle(fastify);
}
