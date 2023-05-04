import {LOGIN_USER, REGISTER_USER} from "./types";
import axios from "axios";

export function registerUser(dataToSubmit) {
  return async dispatch => {
    const response = await axios.post("/api/users/register", dataToSubmit);
    const data = response.data;

    dispatch({
      type: REGISTER_USER,
      payload: data,
    });

    return data;
  };
}
