import {txProcess} from "./../../../lib/db";
import User from "@user/entity/User";
import UserRelation from "@user/entity/UserRelation";

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
    const user = await repository.save({name: name, nickname: nickname, email: email});
    return await repository.save(user);
  });
}
