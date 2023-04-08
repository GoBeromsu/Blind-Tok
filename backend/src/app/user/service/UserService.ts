import {txProcess} from "./../../../lib/db";
import User from "@user/entity/User";

export async function getUserInfo(userid: number) {
  return await User.findOne({where: {userid}, relations: {meta: true}});
}

//TODO: 유저를 추가하는 서비스, 유저를 처음 등록 할 때, email이랑 fake nickname 주지 않나
export async function addUser({fackname}: {fackname: string; email: string}) {}
