import Fastify, {FastifyInstance} from "fastify";
import {Server, IncomingMessage, ServerResponse} from "http";
import {initDatasource} from "./lib/db";
import middleware from "./routes/middleware";
import routes from "./routes";

const PORT: number = Number(process.env.PORT) || 4000;
const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify();

middleware(fastify);
routes(fastify);
async function start() {
  try {
    await initDatasource();
    await fastify.listen({port: PORT, host: "0.0.0.0"});
    console.log(`server start! http://127.0.0.1:${PORT}/`);
  } catch (err: any) {
    console.log(`server loading error... ${err}`);
  }
}

start();
