import {FastifyInstance} from "fastify";
import fastifyMultipart from "@fastify/multipart";

export default async function (fastify: FastifyInstance) {
  //파일 스토리지를 다루기 위함
  fastify.register(fastifyMultipart);
}
