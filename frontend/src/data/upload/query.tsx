import {getAudioFile, postAudioFile} from "./axios";
import {useQuery} from "react-query";
import {options} from "../constant";

export const getAudioQuery = (/*{audioFile: any},*/ userid: any) => {
  const {isLoading, isError, data, error} = useQuery("getAudioData", () => getAudioFile(userid), options);
  return {isLoading, isError, data: data?.data, error};
};
