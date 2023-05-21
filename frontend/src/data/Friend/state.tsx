import {useQuery} from "react-query";
import {getUserInfo} from "@data/user/axios";
import {options} from "@data/constant";
import {getFriendlist} from "@data/Friend/axios";

export const getUserInfoQuery = (userid: number) => {
  const {isLoading, isError, data, error} = useQuery("getFriendlist", () => getFriendlist(userid), options);
  return {isLoading, isError, data: data?.data, error};
};

// [{friendid : number}] 유저와 상태를 가지고 해당 유저의 친구 목록을 뽑아내는 함수
export const getfriendlist = (userid: number, status: string) => {
  let {isLoading, isError, data, error} = getUserInfoQuery(userid);
  let list = data.filter((data: any) => data.status === status);
  list = list.map((data: any) => {
    return;
  });
};
