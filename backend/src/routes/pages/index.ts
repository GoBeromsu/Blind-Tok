import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";

export default async function(fastify:FastifyInstance){
  fastify.get("/*",(req:FastifyRequest,reply:FastifyReply)=>{
    reply.view("/views/index.ejs");
  })
}