import {atom} from "recoil";

export const chatListState = atom<ChatRoom[]>({
  key: "chatListState",
  default: [],
});

export interface ChatRoom {
  roomid: number;
  roomname: string;
  maxnum: number;
  userlist: any[]; // Assuming you have a User type defined somewhere
}
