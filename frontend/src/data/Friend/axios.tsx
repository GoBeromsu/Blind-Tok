import {api} from "@data/constant";

export const getFriendlist = (userid: number) => api.get(`user/friend/${userid}`);
export const addFriend = (userid: number, friendid: number) => api.get(`user/friend/${userid}/${friendid}`);
