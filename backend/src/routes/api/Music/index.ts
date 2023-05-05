import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
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
  fastify.post("/", async (req: FastifyRequest<{}>, reply: FastifyReply) => {
    // const files = req.files();
    const data = await req.file();
    if (!data) {
      reply.status(400).send({error: "No file provided"});
      return;
    }

    const file = data?.file || null; // stream
    const fields = data?.fields; // other parsed parts
    const fieldname = data?.fieldname || null;
    const filename = data?.filename || null;
    const encoding = data?.encoding || null;
    const mimetype = data?.mimetype || null;

    reply.send(filename);
  });
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
