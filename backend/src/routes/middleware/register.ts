import {FastifyInstance} from "fastify";
import fastifyMultipart from "@fastify/multipart";
import {fastifyView} from "@fastify/view";
import formbody from "@fastify/formbody";
import ejs from "ejs";
import fastifyCookie from "@fastify/cookie";
import oauth2 from "@fastify/oauth2";
import {googleAuth} from "@config/auth.config";
import {adam} from "@config/adam.config";
export default async function (fastify: FastifyInstance) {
  // FormBody
  fastify.register(formbody);

  //Cookie
  fastify.register(fastifyCookie, {
    secret: adam?.token.secret, //나중에 구글 sso 시그니쳐 추가해야함
    parseOptions: {httpOnly: true},
  });
  //파일 스토리지를 다루기 위함
  fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  fastify.register(fastifyView, {engine: {ejs}});
  console.log(googleAuth.callbackUri);
  fastify.register(oauth2, googleAuth);
}
