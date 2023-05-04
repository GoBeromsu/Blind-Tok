import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import friend from "../User/friend";
import {addUser, editUser, getUserInfo, getUsersInfo} from "@user/service/UserService";
import {addMusic, editMusic, getMusicInfo, getMusicsInfo} from "../../../app/music/service/MusicService";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const musics = await getMusicsInfo();
    reply.send(musics);
  });
  fastify.get("/:musicid", async (req: FastifyRequest<{Params: {musicid: number}}>, reply: FastifyReply) => {
    const {musicid} = req.params;
    const music = await getMusicInfo(musicid);
    reply.send(music);
  });
  fastify.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: {
          userid: number;
          fileName: string;
          filePath: string;
          mimeType: string;
          duration: number;
          fileSize: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const music = await addMusic(req.body);
      reply.send(music);
    },
  );
  fastify.put(
    "/:musicid",
    async (
      req: FastifyRequest<{
        Params: {musicid: number};
        Body: {
          userid: number;
          fileName: string;
          filePath: string;
          mimeType: string;
          duration: number;
          fileSize: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const {musicid} = req.params;
      const selected = await editMusic(musicid, req.body);
      reply.send(selected);
    },
  );
}
