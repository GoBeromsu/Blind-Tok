import {txProcess} from "@lib/db";
import Auth from "../entity/Auth";

export async function getAuthList() {
  return await Auth.find();
}
export async function getAuthInfo(authid: string) {
  return await Auth.findOne({where: {authid}});
}
export async function addAuth(auth: {authid: string; authname: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Auth);
    return await repository.save(auth);
  });
}
export async function removeAuth(authid: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Auth);
    return await repository.delete({authid});
  });
}
