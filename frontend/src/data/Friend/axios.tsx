import {api} from "@data/constant";

export const getFriendlist = (userid: number) => api.get(`user/friend/${userid}`);
export const addFriend = (userid: number, friendid: number) => api.post(`user/friend/${userid}/${friendid}`);
export const editFriendStatus = (relationid: number, str: string) => api.put(`user/friend/${relationid}`, {status: str});
export const getRelation = (userid: number) => api.get(`user/friend/relation/${userid}`);
