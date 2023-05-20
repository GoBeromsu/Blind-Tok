import {atom} from "recoil";

export const userState = atom({
  key: "userState",
  // default: userSelector,
  default: null,
});
