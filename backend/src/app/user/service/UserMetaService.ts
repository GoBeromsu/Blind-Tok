import {txProcess} from "@lib/db";
import UserMeta from "@user/entity/UserMeta";

export async function editProfileMessage(userid: number, profileMessage: string) {
  return await txProcess(async manager => {
    const metaRepository = manager.getRepository(UserMeta);
    await metaRepository.update({userid}, {profileMessage: profileMessage});
  });
}

export async function editProfilePictureurl(userid: number, profilePictureUrl: string) {
  return await txProcess(async manager => {
    const metaRepository = manager.getRepository(UserMeta);
    await metaRepository.update({userid}, {profilePictureUrl: profilePictureUrl});
  });
}
