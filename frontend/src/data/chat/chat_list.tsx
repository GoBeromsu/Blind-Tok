let chatList: any[] = [];

// 유저가 속한 방 목록을 data로 받아서 chat_list에 저장하는 함수
// 서버에서 유저가 속한 방의 room_id 리스트를 받아온다.
// 받아온 데이터에는 최신 메시지를 저장할 속성이 없기 때문에 lastMessage 자리를 만들어준다.
// 배열의 맵 함수를 통해 data의 각 원소마다 반복하여 배열을 만들어서 chat_list에 저장한다.
// 마지막으로 갱신된 chat_list를 반환한다.
// export function setChatList(data: {roomid: number; roomname: string; userlist: any}[], lastMessage: string = "") {
//   console.log("setChatList: ", data);
//   chatList = Array.from(data, chatRoom => ({...chatRoom, lastMessage}));
//   return chatList;
// }

export function setChatList(data: {roomid: number; roomname: string; userlist: any}[]) {
  console.log("setChatList : ", data);

  const updatedChatList = data.map((chatRoom: any) => {
    return {...chatRoom, lastMessage: ""};
  });
  chatList = updatedChatList;
  return chatList;
}

// 변수 chat_list의 값을 반환하는 함수
export function getChatList() {
  return chatList;
}

// 방에 초대 받았을 경우 방에 대한 정보가 들어온다.
// 이 때 기존의 방목록에 초대 받은 방을 추가하는 함수
// setChatList와 동일하게 roomid만 받기 때문에 lastMessage 속성을 만들어준다.
// 또한 이 함수가 실행되는 시점에서 이 방의 생성이 가장 최근에 발생한 이벤트임으로
// 방목록의 제일 앞에 이 방을 추가해준다. => 방 목록의 시간 순 정렬을 위함
// export function addChat_list(data: any) {
//   console.log("addChat_list : ", data);
//   data = {...data, lastMessage: ""};
//   return setChatList(data, "");
// }
export function addChat_list(data: any) {
  console.log("addChat List", data);
  data = {...data, lastMessage: ""};
  chatList = [data, ...chatList];
  return chatList;
}

// 방 나갈때 방 목록에서 해당 방을 제거하는 함수
// 해방 방의 인덱스를 찾고 이를 추출하고 반환한다.
export function removeChat_list(roomid: number) {
  chatList = chatList.filter(data => data.roomid !== roomid);
  return chatList;
}

// 해당 방에는 방에 속해 있는 유저목록이 존재한다.
// 따라서 유저가 나갔을 때 이 목록을 갱신해줘야되며
// 이는 서버로 부터 받아서 실행한다.
// chat_list를 반환하는 이유는 이후에 chatBar에서 현재 참여한 유저의 목록을 구현하면
// 그 때 이를 이용해야한다.
// 아직 미구현
export function subUserChat_list(roomid: number, userid: string) {
  chatList = chatList.map((chat: any) =>
    chat.roomid === roomid ? {...chat, userlist: chat.userlist.filter((user: any) => user.userid !== userid)} : chat,
  );
  console.log(chatList);
  return chatList;
}

// subUserChat_list와 마찬가지로 유저가 참여했을 때도 목록 갱신이 필요하다.
export function addUserChat_list(roomid: number, userid: string) {
  chatList = chatList.map((chat: any) => (chat.roomid === roomid ? {...chat, userlist: [...chat.userlist, {userid}]} : chat));
  console.log(chatList);
  return chatList;
}

// 채팅방의 lastMessage를 설정하는 함수
// lastMessage가 갱신된다는 의미는 가장 최근 발생한 이벤트를 의미한다.
// 따라서 lastMessage를 갱신하면서 방 목록의 가장 위로 올린다.
export function setListMessage(roomid: number, message: any) {
  const index = chatList.findIndex((data: any) => data.roomid === roomid);
  const room = chatList[index];
  room.lastMessage = message;
  chatList = [room, ...chatList.slice(0, index), ...chatList.slice(index + 1)];
  return chatList;
}
