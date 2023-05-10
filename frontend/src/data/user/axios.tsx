import {api, axiosProcess, server} from "../constant";
export const getUserList = () => api.get("/user");

export const getUserInfo = (userid: number) => api.get(`/user/${userid}`);

// export function postUserRegistAxios(userInfo: postUser) {
//   return api.post("/user", userInfo);
// }

export async function getAuthUser() {
  return axiosProcess(() => server.get(`/auth/user`), false).catch(err => null);
}

let friend_list = [
  {
    id: 1,
    user_id: "gogogo",
    list: [
      {
        user_id: "choichoichoi",
        nickname: "최승주",
      },
    ],
  },
  {
    id: 2,
    user_id: "choochoochoo",
    list: [
      {
        user_id: "choichoichoi",
        nickname: "최승주",
      },
    ],
  },
  {
    id: 3,
    user_id: "choichoichoi",
    list: [
      {
        user_id: "gogogo",
        nickname: "고범수",
      },
      {
        user_id: "choochoochoo",
        nickname: "추우엽",
      },
    ],
  },
];

//데이터 조회
// export function getFriendlist(id) {
//   return friend_list.find(user_id => user_id.user_id === id).list;
// }
