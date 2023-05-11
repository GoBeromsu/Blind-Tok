import {api, axiosProcess, server} from "../constant";

export async function getGoogleInfoAxios(code: string) {
  return server.post("/auth/google/callback", {code});
}

export async function getToken({userid, ssoid}: {userid: string; ssoid: string}) {
  return await axiosProcess(async () => {
    return await server.post("/auth/token", {userid, ssoid});
  });
}
