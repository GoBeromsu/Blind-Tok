import {FastifyInstance} from "fastify";
import fastifyMultipart from "@fastify/multipart";
import {fastifyView} from "@fastify/view";
import formbody from "@fastify/formbody";
import ejs from "ejs";

export default async function (fastify: FastifyInstance) {
  // FormBody
  fastify.register(formbody);

  //파일 스토리지를 다루기 위함
  fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  fastify.register(fastifyView, {engine: {ejs}});
}
