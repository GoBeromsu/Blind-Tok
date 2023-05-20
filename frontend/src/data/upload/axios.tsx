// data/axios.ts
import axios from "axios";
import {api, axiosProcess, server} from "../constant";

const uploadFile = async (file: File, user: any, ) => {
  const url = server+`/`
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user", JSON.stringify(user));

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
export async function poAuthUser() {
  return axiosProcess(() => server.get(`/auth/user`), false).catch(err => null);
}
export default {
  uploadFile,
};
