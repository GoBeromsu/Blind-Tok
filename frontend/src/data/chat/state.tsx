import {atom, selector} from "recoil";

export interface ChatRoom {
  roomid: number;
  roomname: string;
  minnum: number;
  maxnum: number;
  userlist: {userid: string; datanum: number}[];
}

export const chatListState = atom<ChatRoom[]>({
  key: "chatListState",
  default: [],
});
