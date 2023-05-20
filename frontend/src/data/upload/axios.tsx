// data/axios.ts
import {api, axiosProcess, server} from "../constant";

export const getAudioFile = (file: any, userid: number) => api.get(`/audio/${file}`);

export function postAudioFile(audio: any, userid: number) {
  return api.post(`/file/${audio}`);
}
