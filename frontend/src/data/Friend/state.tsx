import {useQuery} from "react-query";
import {getUserInfo} from "@data/user/axios";
import {options} from "@data/constant";
import {addFriend, getFriendlist, getRelation} from "@data/Friend/axios";

export const getFriendListQuery = (userid: number) => {
  const {isLoading, isError, data, error, refetch} = useQuery("getFriendlist", () => getFriendlist(userid), options);
  return {isLoading, isError, data: data?.data, error, refetch};
};
export const addFriendQuery = (userid: number, friendid: number) => {
  const {isLoading, isError, data, error} = useQuery("addFriend", () => addFriend(userid, friendid), options);
  return {isLoading, isError, data: data, error};
};

export const getFriends = (userid: number) => {
  const {isLoading, isError, data, error} = useQuery("getFriends", () => getRelation(userid), options);
  return {isLoading, isError, data: data?.data, error};
};
