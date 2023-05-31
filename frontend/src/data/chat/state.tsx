import {atom} from "recoil";

export const socketState = atom({
  key: "socketState",
  // default: userSelector,
  default: null,
});
