import {txProcess} from "@lib/db";
import File from "../entity/File";

export async function getFileInfo(fileid: string) {
  return await File.findOne({where: {fileid}, relations: {user: true}});
}
export async function getFilesInfo() {
  return await File.find({relations: {user: true}});
}
export async function addFile(file: {
  userid: number;
  fileid: string;
  filename: string;
  filepath: string;
  filesize: number;
  filetype: string;
  mimetype: string;
}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(File);
    return repository.save(file);
  });
}
export async function editFile({
  fileid,
  userid,
  fileName,
  filePath,
  filetype,
  mimetype,
  fileSize,
}: {
  fileid: string;
  userid: number;
  fileName: string;
  filePath: string;
  filetype: string;
  mimetype: string;
  fileSize: number;
}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(File);
    return repository.update(fileid, {
      userid,
      filename: fileName,
      filepath: filePath,
      filetype,
      mimetype,
      filesize: fileSize,
    });
  });
}
export async function removeFile(fileid: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(File);
    return await repository.delete(fileid);
  });
}
