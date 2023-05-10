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
export const server = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});
export async function axiosProcess(caller, isLogin = false) {
  try {
    return await caller();
  } catch (err) {
    console.error(" axiosProcess >>", err);
    if (err?.response?.status === 500) {
      console.error(err);
    } else if (isLogin) {
      //refresh token 남아 있으면 갱신?!

      const {data} = await server.post("/auth/refreshToken");
      if (data === "USER_AUTHENTICATED") {
        return await caller();
      }
    } else {
      console.error("access_token 있지만, 만료되어 재접속");
      throw err;
    }
    //FIXME: alert으로 알려주고 넘어가야하는지 확인
    return null;
  }
}
