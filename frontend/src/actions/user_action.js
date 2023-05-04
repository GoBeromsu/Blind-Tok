import {LOGIN_USER, REGISTER_USER} from "./types";
import axios from "axios";

export function registerUser(dataToSubmit) {
  // axios를 이용해 login 요청을 보내고 response.data를 반환하여 request에 넣어준다.
  const request = axios.post("/api/users/register", dataToSubmit).then(response => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}
