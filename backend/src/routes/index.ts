import {FastifyInstance} from "fastify";
import pages from "./pages";

export default async function (fastify:FastifyInstance){
  fastify.register(pages,{prefix:"/"})
}