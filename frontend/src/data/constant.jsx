import axios from "axios";

export const options = {
  refetchOnWindowFocus: false,
  retry: 0,
  onSuccess: result => {
    //api 호출 성공
    console.log("onSuccess >>", result?.data);
  },
  onError: error => {
    //api 호출 실패
    console.log("onError >> ", error.message);
  },
};
export const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});
