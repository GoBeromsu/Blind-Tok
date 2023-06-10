import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import fs from "fs";
import {pipeline, Readable} from "stream";
import util from "util";
import {format} from "date-fns";
import {generatedUUID} from "@utils/UUIDUtils";
import {addFile, deleteFile, editFile, getFileInfo, getFilesByUser, getFilesInfo} from "@file/service/FileService";
import * as path from "path";
const pump = util.promisify(pipeline);

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const files = await getFilesInfo();
    reply.send(files);
  });
  fastify.get("/user/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const files = await getFilesByUser(userid);
    reply.send(files);
  });
  fastify.get("/:fileid", async (req: FastifyRequest<{Params: {fileid: string}}>, reply: FastifyReply) => {
    const {fileid} = req.params;
    const result = await getFileInfo(fileid);
    if (result) {
      const ext = result.mimetype.split("/")[1];
      const filepath = `${result?.filepath}/${fileid}`;
      const absolutepath = path.join(__dirname, "../../../../") + filepath;
      const filename = encodeURI(result.filename);
      const file = fs.readFileSync(absolutepath);
      reply.headers({
        "Content-Disposition": `attachment; filename=${filename}`,
        "Content-Transfer-Encoding": `binary`,
        "Content-Type": `application/octet-stream`,
      });
      reply.send(file);
    } else {
      reply.send(result);
    }
    // reply.send(file);
  });

  fastify.post("/", async (req: FastifyRequest<{Body: {file: any; userid: any; image: any; comment: any}}>, reply: FastifyReply) => {
    const userid = req.body.userid?.value;
    const file = req.body.file;
    const {comment, image} = req.body;
    console.log(req.body.image);
    if (!file) {
      reply.status(400).send({error: "No file provided"});
      return;
    }
    const fileresult = [];
    // const part = part?.file || null; // stream
    const filename = file?.filename || "";
    const filetype = file?.mimetype || "";
    const fileid = await makefile(userid, file, filename, filetype, comment?.value, image?.value);
    fileresult.push(fileid);
    reply.send({files: fileresult, filetype});
  });

  fastify.delete("/:fileid", async (req: FastifyRequest<{Params: {fileid: string}}>, reply: FastifyReply) => {
    console.log(req.params);
    const {fileid} = req.params;
    const result = await deleteFile(fileid);
    reply.send(result);
  });

  async function makefile(userid: any, part: any, filename: string, filetype: string, comment: string, image: string) {
    const mimetype = part.mimetype;
    const fileid = generatedUUID();
    const img_root = "public/temp";
    const filepath = img_root + "/" + format(new Date(), "yyyy/MM/dd/HH");
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, {recursive: true});
    }
    const filesize = part.file.bytesRead;

    await addFile({userid: userid, fileid: fileid, filename, filepath, filesize, mimetype, filetype, comment, image});
    // 확장자 없이 저장 + 파일 중복을 피하기 위해 fileid로 저장
    const newfilepath = filepath + "/" + fileid;

    const buffer = await part.toBuffer();
    await pump(Readable.from(buffer), fs.createWriteStream(newfilepath));

    return {fileid, filename, filepath: newfilepath};
  }
}
