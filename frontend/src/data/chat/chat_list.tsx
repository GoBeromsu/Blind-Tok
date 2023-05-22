import {setList} from "@views/Chat/ChatList";

var chat_list = new Array();

export function setChatList(data: any) {
  chat_list = data.map((data:any) => {return {...data,last_Message : ""}});
  console.log("-----chat_list(set)-----");
  console.log(chat_list);
}

export function getChat_list() {
  return chat_list;
}

export function addChat_list(data: any) {
  data = {...data, last_Message:""};
  chat_list = [data, ...chat_list];
  console.log("-----chat_list(add)-----");
  console.log(chat_list);
}

export function subChat_list(room_id: string, user_id: string) {
  chat_list = chat_list.map((chat: any) => (chat.room_id === room_id ? chat.user_list.filter((user: any) => user.user_id !== user_id) : chat));
}

export function setListMessage(room_id:string, message:any){
  let temp : any = chat_list.splice(chat_list.findIndex((data:any) => data.room_id === room_id),1);
  temp[0].last_Message = message;
  chat_list = [temp[0], ...chat_list];
  setList();
}