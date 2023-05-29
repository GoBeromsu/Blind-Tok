import {api, axiosProcess, server} from "../constant";

export async function getGoogleInfoAxios(code: string) {
  return server.post("/auth/google/callback", {code});
}

export async function getToken({userid, ssoid}: {userid: string; ssoid: string}) {
  return await axiosProcess(async () => {
    return await server.post("/auth/token", {userid, ssoid});
  });
}
export async function postUser(user: any) {
  try {
    const res = await api.post(`/user`, user);
    return res;
  } catch (error) {
    throw new Error("Failed to post user");
  }
}
