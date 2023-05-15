import {useQuery} from "react-query";
import {getUserInfo} from "@data/user/axios";
import {options} from "@data/constant";
import {getFriendlist} from "@data/Friend/axios";

export const getUserInfoQuery = (userid: number) => {
  const {isLoading, isError, data, error} = useQuery("getFriendlist", () => getFriendlist(userid), options);
  return {isLoading, isError, data: data?.data, error};
};
