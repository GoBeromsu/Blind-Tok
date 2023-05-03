import {txProcess} from "@lib/db";
import User from "@user/entity/User";
import UserRelation from "@user/entity/UserRelation";
import UserMeta from "@user/entity/UserMeta";

export async function getUserInfo(userid: number) {
  return await User.findOne({where: {userid}, relations: {meta: true}});
}
export async function getUsersInfo() {
  return await User.find({relations: {meta: true}});
}
export async function addUser({name, email}: {name: string; email: string}) {
  // TODO: 현재 닉네임을 부여하는 기능이 없어서 이름과 동일하게 nickname을 부여하겠음
  const nickname = name;
  return await txProcess(async manager => {
    const repository = manager.getRepository(User);
    const friendRepository = manager.getRepository(UserRelation);
    const metaRepository = manager.getRepository(UserMeta);
    const user = await repository.save({name: name, nickname: nickname, email: email});

    const userid = user.userid;
    //TODO: 현재 프로필 메시지와 프로필 이미지 URL는 Default 값을 지정하겠습니다
    user.meta = await metaRepository.save({userid: userid, profilemesage: " ", profilepictureurl: " "});
    return user;
  });
}
export async function editUser(
  userid: number,
  {
    name,
    nickname,
    profilemesage,
    profilepictureurl,
    email,
  }: {
    name: string;
    nickname: string;
    profilemesage: string;
    profilepictureurl: string;
    email: string;
  },
) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(User);
    const metaRepository = manager.getRepository(UserMeta);
    const user = await repository.update({userid}, {name: name, nickname: nickname, email: email});

    await metaRepository.update({userid}, {profilemesage, profilepictureurl});
    return user;
  });
}
//TODO: 유저 삭제하는 기능은 당장은 안필요한 듯..?
export async function removeUser() {}
