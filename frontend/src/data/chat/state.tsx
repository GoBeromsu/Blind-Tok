import {atom, selector} from "recoil";
import {getRooms} from "@data/chat/index";

export interface ChatRoom {
  roomid: number;
  roomname: string;
  maxnum: number;
  userlist: any[]; // Assuming you have a User type defined somewhere
}
export const chatListState = atom<ChatRoom[]>({
  key: "chatListState",
  default: [],
});
