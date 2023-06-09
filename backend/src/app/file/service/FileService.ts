import {txProcess} from "@lib/db";
import File from "../entity/File";

export async function getFileInfo(fileid: string) {
  return await File.findOne({where: {fileid}, relations: {user: true}});
}
export async function getFileNameInfo(filename: string) {
  return await File.find({where: {filename}, relations: {user: true}});
}
export async function getFilesInfo() {
  return await File.find({relations: {user: true}});
}
export async function getFilesByUser(userid: number) {
  return await File.find({where: {userid}, relations: {user: true}});
}
export async function addFile(file: {
  userid: number;
  fileid: string;
  // fileimage: any;
  // filecomment:string;
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
  // fileimage,
  // filecomment,
  filename,
  filepath,
  filetype,
  mimetype,
  filesize,
}: {
  fileid: string;
  userid: number;
  // fileimage:any;
  // filecomment:string;
  filename: string;
  filepath: string;
  filetype: string;
  mimetype: string;
  filesize: number;
}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(File);
    return repository.update(fileid, {
      userid,
      // fileimage,
      // filecomment,
      filename,
      filepath,
      filetype,
      mimetype,
      filesize,
    });
  });
}
export async function deleteFile(fileid: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(File);
    return await repository.delete(fileid);
  });
}
