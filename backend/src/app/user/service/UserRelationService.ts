import {txProcess} from "@lib/db";
import UserRelation from "@user/entity/UserRelation";

// TODO: 아래와 같이 친구 관리를 할 경우, 상호 관계 친구는 대등한 관계인데, 조회 할 때 번거로움의 문제가 발생함
export async function getFriendInfo(userid: number) {
  return await UserRelation.find({where: [{userid: userid}, {friend: {userid: userid}}]});
}
export async function getFriendsInfo() {
  return await UserRelation.find();
}
export async function addFriend(relation: {userid: number; friendid: number}) {
  return await txProcess(async manager => {
    const userRelationRepository = manager.getRepository(UserRelation);
    return await userRelationRepository.save(relation);
  });
}
export async function editFriend(
  relationid: number,
  {
    status,
  }: {
    status: string;
  },
) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserRelation);
    return repository.update(relationid, {status});
  });
}
export async function removeFriend(relation: {userid: number; friendid: number}) {
  return await txProcess(async manager => {
    const userRelationRepository = manager.getRepository(UserRelation);
    return await userRelationRepository.delete(relation);
  });
}
