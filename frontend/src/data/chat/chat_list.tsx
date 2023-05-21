var chat_list = new Array();

export function setChatList(data: any) {
  chat_list = data;
  console.log("-----chat_list(set)-----");
  console.log(chat_list);
}

export function getChat_list() {
  return chat_list;
}

export function addChat_list(data: any) {
  chat_list = [data, ...chat_list];
  console.log("-----chat_list(add)-----");
  console.log(chat_list);
}

export function subChat_list(room_id: string, user_id: string) {
  chat_list = chat_list.map((chat: any) => (chat.room_id === room_id ? chat.user_list.filter((user: any) => user.user_id !== user_id) : chat));
}
