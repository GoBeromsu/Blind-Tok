import {txProcess} from "@lib/db";
import LoginHistory from "@user/entity/LoginHistory";

export async function addLoginHistory(history: {userid: number; ssoid: string; token?: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(LoginHistory);
    return await repository.save(history);
  });
}
