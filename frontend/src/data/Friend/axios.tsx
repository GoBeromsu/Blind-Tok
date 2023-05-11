import {api} from "@data/constant";

export const getFriendlist = (userid: number) => api.get(`user/friend/${userid}`);
