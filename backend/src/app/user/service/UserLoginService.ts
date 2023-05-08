import UserLogin from "@user/entity/UserLogin";
import User from "@user/entity/User";
import {txProcess} from "@lib/db";

export async function getUserLogin(ssoid: string, userid?: number) {
  //[SOON-001] 내용입력
  //[MAINTAIN-001] 내용입력
  return await UserLogin.findOne({where: {ssoid, userid}, relations: {user: {login: true, auth: true}}}); //이제 auth도 가져온다 02.15
}
export async function addUserLogin(userid: number, login: {ssoid: string; email: string; type: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserLogin);
    const userRepository = manager.getRepository(User);
    const user = await userRepository.findOne({where: {userid}});
    if (user) {
      return await repository.save({userid, ...login});
    } else {
      return new Error("ERROR_AUTH_NOTEXISTS");
    }
  });
}
export async function removeUserLogin({userid, ssoid}: {userid: number; ssoid: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserLogin);
    return await repository.delete({userid, ssoid});
  });
}
