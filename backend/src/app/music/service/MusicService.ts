import {txProcess} from "@lib/db";
import Music from "../entity/Music";

export async function getMusicInfo(musicid: number) {
  return await Music.findOne({where: {musicid}, relations: {user: true}});
}
export async function getMusicsInfo() {
  return await Music.find({relations: {user: true}});
}
export async function addMusic({
  userid,
  fileName,
  filePath,
  mimeType,
  duration,
  fileSize,
}: {
  userid: number;
  fileName: string;
  filePath: string;
  mimeType: string;
  duration: number;
  fileSize: number;
}) {
  const nickname = name;
  return await txProcess(async manager => {
    const repository = manager.getRepository(Music);
    return repository.save({userid, fileName, filePath, mimeType, duration, fileSize});
  });
}
export async function editMusic(
  musicid: number,
  {
    userid,
    fileName,
    filePath,
    mimeType,
    duration,
    fileSize,
  }: {
    userid: number;
    fileName: string;
    filePath: string;
    mimeType: string;
    duration: number;
    fileSize: number;
  },
) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Music);
    return repository.update(musicid, {
      userid,
      fileName,
      filePath,
      mimeType,
      duration,
      fileSize,
    });
  });
}
//TODO: 추후에 필요하면 추가로 생성합니다
export async function removeMusic() {}
