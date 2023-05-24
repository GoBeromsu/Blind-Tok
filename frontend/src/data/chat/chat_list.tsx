import {setList} from "@views/Chat/ChatList";
import {leaveRoom} from "socket";

let chat_list = new Array();

export function setChatList(data: any) {
  chat_list = data.map((data: any) => {
    return {...data, last_Message: ""};
  });
  console.log("-----chat_list(set)-----");
  console.log("Chat List : ", chat_list);
}

export function getChat_list() {
  return chat_list;
}

export function addChat_list(data: any) {
  data = {...data, last_Message: ""};
  chat_list = [data, ...chat_list];
  console.log("-----chat_list(add)-----");
  console.log(chat_list);
}

export function removeChat_list(roomid: string) {
  let index = chat_list.findIndex(data => data.roomid === roomid);
  chat_list.splice(index, 1);
}

export function subUserChat_list(roomid: string, userid: string) {
  chat_list = chat_list.map((chat: any) => (chat.roomid === roomid ? chat.user_list.filter((user: any) => user.userid !== userid) : chat));
  console.log(chat_list);
}
export function addUserChat_list(roomid: string, userid: string) {
  chat_list = chat_list.map((chat: any) => (chat.roomid === roomid ? chat.user_list.pust({userid: userid}) : chat));
  console.log(chat_list);
}

export function setListMessage(roomid: string, message: any) {
  let temp: any = chat_list.splice(
    chat_list.findIndex((data: any) => data.roomid === roomid),
    1,
  );
  temp[0].last_Message = message;
  chat_list = [temp[0], ...chat_list];
  setList();
}
