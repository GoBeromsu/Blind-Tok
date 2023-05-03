import User from "@user/entity/User";
import {txProcess} from "@lib/db";
import UserRelation from "@user/entity/UserRelation";
import UserMeta from "@user/entity/UserMeta";

// TODO: 아래와 같이 친구 관리를 할 경우, 상호 관계 친구는 대등한 관계인데, 조회 할 때 번거로움의 문제가 발생함
export async function getFriendInfo(userid: number, friendid: number) {
  return await UserRelation.findOne({where: {user: {userid}, friend: {userid: friendid}}, relations: {user: true, friend: true}});
}
export async function getFriendsInfo(userid: number) {
  return await UserRelation.find({where: {user: {userid}}, relations: {user: true, friend: true}});
}
export async function addFriend(relation: {userid: number; friendid: number}) {
  return await txProcess(async manager => {
    const userRelationRepository = manager.getRepository(UserRelation);
    return await userRelationRepository.save(relation);
  });
}
export async function removeFriend(relation: {userid: number; friendid: number}) {
  return await txProcess(async manager => {
    const userRelationRepository = manager.getRepository(UserRelation);
    return await userRelationRepository.delete(relation);
  });
}
