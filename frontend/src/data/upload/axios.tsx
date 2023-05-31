// data/axios.ts
import axios from "axios";
import {api, axiosProcess, server} from "../constant";

export async function getAudioFile(userid: any) {
  try {
    const getData = await api.get(`file/user/${userid}`);
    return getData;
  } catch (error) {
    throw new Error("Failed to fetch audio files");
  }
}

// export async function getAllFile(userid: any) {
//   try {
//     const Data = await api.get(`file/user/${userid}`);
//     return getData;
//   } catch (error) {
//     throw new Error("Failed to fetch audio files");
//   }
// }

// 삭제하려는 fileid와 그 요청을 보내는 user의 id를 받아서 서버로 요청을 보내는 함수.
export function deleteAudioFile(audioFile: any, loginUser: any) {
  try {
    const res = api.delete(`/file/${audioFile.fileid}`);
    return res;
  } catch (error) {
    throw new Error("Failed to delete audio files");
  }
}

// 오디오 파일 서버에 보내기 및 에러 처리
export function postAudioFile(formData: any, userid: any) {
  try {
    formData.append("userid", userid);
    const res = api.post(`/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log("File upload failed:", error);
  }
}
