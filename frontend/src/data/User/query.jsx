// import {getUserList} from "./axios";
// import {options} from "../constant";

let users = [
  {
    id: 1,
    user_id: "gogogo",
    nickname: "고범수",
    image: "",
    e_mail: "1@naver.com",
    phone_n: "000-1111-2222",
    detail: "안녕하세요. 고범수입니다.",
  },
  {
    id: 2,
    user_id: "choochoochoo",
    nickname: "추우엽",
    image: "",
    e_mail: "2@naver.com",
    phone_n: "000-2222-3333",
    detail: "안녕하세요. 추우엽입니다.",
  },
  {
    id: 3,
    user_id: "choichoichoi",
    nickname: "최승주",
    image: "",
    e_mail: "3@naver.com",
    phone_n: "000-3333-4444",
    detail: "안녕하세요. 최승주입니다.",
  },
];

//user 데이터 조회
export default function getUser(id = 0) {
  return users.find(user => user.user_id === id);
}
// export const getUserListQuery = () => {
//   const {isLoading, isError, data, error} = fetch("getUserList", getUserList, options);
//   return {isLoading, isError, data: data?.data, error};
// };