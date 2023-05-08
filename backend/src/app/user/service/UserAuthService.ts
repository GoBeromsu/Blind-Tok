import UserAuth from "@user/entity/UserAuth";

export async function getUserAuthList(userid: number) {
  return await UserAuth.find({where: {userid}});
}
