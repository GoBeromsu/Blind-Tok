import {atom} from "recoil";

export const userState = atom({
  key: "userState",
  // default: userSelector,
  default: null,
});

export const sideState = atom({
  key: "sideState",
  default: true,
});
