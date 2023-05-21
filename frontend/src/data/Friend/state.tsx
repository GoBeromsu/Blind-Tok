import {useQuery} from "react-query";
import {getUserInfo} from "@data/user/axios";
import {options} from "@data/constant";
import {addFriend, getFriendlist} from "@data/Friend/axios";

export const getFriendListQuery = (userid: number) => {
  const {isLoading, isError, data, error} = useQuery("getFriendlist", () => getFriendlist(userid), options);
  return {isLoading, isError, data: data?.data, error};
};
export const addFriendQuery = (userid: number, friendid: number) => {
  const {isLoading, isError, data, error} = useQuery("addFriend", () => addFriend(userid, friendid), options);
  return {isLoading, isError, data: data, error};
};
export const getFriendList = (userid: number, status:string) => {
  let temp = getFriendListQuery(userid).data;
  temp = temp.map((data:any) => {
    return {user_id: data.friendid}; 
  });
  return temp;
}