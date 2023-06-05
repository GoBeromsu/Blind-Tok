import {sendMessage} from "@data/chat/index";
import {getChatList, setChatList, addChatList, removeChat_list, setListMessage, addUserChat_list, subUserChat_list} from "@data/chat/chat_list";
import {getChatData, updateChatData, updateData_s, subData} from "@data/chat/chat_data";
import {updateChat} from "@views/Chat/ChatRoom";
import {setList} from "@views/Chat/ChatList";

// 채팅방 생성
// chatList에서 초대할 친구를 선택해서 소켓으로 전송
export function createRoom(user: any, userlist: any[], roomname: string = "") {
  const data = {user, userlist, roomname};
  // console.log("createRoom : ", data);
  sendMessage(data, "createRoom");
}

// 채팅방에 유저 추가
// 이미 만들어져 있는 방에 유저를 추가하는 함수
// chatBar에서 초대할 친구를 리스트로 만들어서 소켓으로 전송
export function addUser(roomid: number, userlist: any[]) {
  sendMessage({roomid, userlist}, "addUser");
}
export function joinVideoChat(roomid: number, userlist: any[]) {
  sendMessage({roomid, userlist}, "joinVideoChat");
}

// 채팅방 나가기
// 참여하고 있는 채팅방에서 나가는 함수
// chatBar에서 방 아이디를 받아 실행
// subData : 해당 방의 데이터 삭제
// removeChat_list : chat_list의 chat_list 변수에서 방 삭제 / 실행 후 chat_list를 반환
// setList : 입력 값으로 chatList의 목록 갱신 => 목록의 리렌더링이 발생
export function leaveRoom(roomid: number, userid: string) {
  subData(roomid);
  setList(removeChat_list(roomid));
  sendMessage({roomid: roomid, userid: userid}, "leaveRoom");
}

// 입력한 메시지 전송
// 방 아이디와 보내는 유저의 정보, 입력한 메시지를 받아 전송
// 입력한 메시지를 가공하여 전송한다.
export function sendEnteredMessage(roomid: number, loginUser: any, data: string) {
  let today = new Date();
  let hours: any = today.getHours(); // 시
  hours = hours < 10 ? "0" + hours : hours; // 자릿수 맞추기
  let minutes: any = today.getMinutes(); // 분
  minutes = minutes < 10 ? "0" + minutes : minutes; // 자릿수 맞추기
  const message = {
    roomid: roomid,
    userid: loginUser?.userid,
    nickname: loginUser?.nickname,
    time: `${hours} : ${minutes}`,
    data_s: data,
  };
  console.log("sendEnteredMessage : ", message);
  sendMessage(message, "enteredMessage");
}

// 유저가 속한 방의 리스트 목록 반환 함수
// getChat_list : chatList에서 처음 실행시 chat_list의 chat_list변수에서 유저 방목록을 가져온다.
export function init_list() {
  return getChatList();
}
