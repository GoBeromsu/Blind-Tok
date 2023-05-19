import {FastifyInstance} from "fastify";
import pages from "./pages";
import api from "./api";
import auth from "./auth";
import socket from "./socket";

export default async function (fastify: FastifyInstance) {
  fastify.register(pages, {prefix: "/"});
  fastify.register(api, {prefix: "/api/v1/"});
  fastify.register(auth, {prefix: "/auth"});
  fastify.register(socket, {prefix: "/socket"});
  type jwt = {
    userid: number;
    email: string;
    iat: number;
    exp: number;
  };
}
