import {sendMessage} from "../socket";
import {getChatList, setChatList, addChat_list, removeChat_list, setListMessage, addUserChat_list, subUserChat_list} from "@data/chat/chat_list";
import {getChatData, updateChatData, updateData_s, subData} from "@data/chat/chat_data";
import {updateChat} from "@views/Chat/ChatRoom";
import {setList} from "@views/Chat/ChatList";

// 채팅방 생성
// chatList에서 초대할 친구를 선택해서 소켓으로 전송
export function createRoom(user: any, userlist: any[], roomname: string = "") {
  let data = {user, userlist, roomname};
  sendMessage(data, "create_room");
}

// 채팅방에 유저 추가
// 이미 만들어져 있는 방에 유저를 추가하는 함수
// chatBar에서 초대할 친구를 리스트로 만들어서 소켓으로 전송
export function addUser(roomid: any, userlist: any[]) {
  sendMessage({roomid, userlist}, "add_user");
}

// 채팅방 나가기
// 참여하고 있는 채팅방에서 나가는 함수
// chatBar에서 방 아이디를 받아 실행
// subData : 해당 방의 데이터 삭제
// removeChat_list : chat_list의 chat_list 변수에서 방 삭제 / 실행 후 chat_list를 반환
// setList : 입력 값으로 chatList의 목록 갱신 => 목록의 리렌더링이 발생
export function leaveRoom(roomid: number) {
  subData(roomid);
  setList(removeChat_list(roomid));
  sendMessage(roomid, "leave_room");
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
    userid: loginUser.userid,
    usernickname: loginUser.nickname,
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

// 로컬 저장소에 저장된 방 데이터 내용을 가져오는 함수
// chatRoom에서 처음 실행시 이 함수를 불러 방의 데이터를 불러온다.
// export function init_ChattingData(roomid: number) {
//   return getChatData(roomid);
// }

// 소켓 서버로부터 받는 메시지 처리 함수
// id를 통해 각 상황에 맞춰 분류한다.
export function recMessage(datas: any) {
  let {id, data} = datas;
  switch (id) {
    // 채팅 메시지를 받았을 경우
    // updateChatData : 로컬 저장소에 저장한다.
    // updateChat : 채팅 방의 채팅 내용을 갱신한다.
    // setListMessage : chatList에서 해당 방의 최신 메시지의 내용을 갱신한다. / chat_list를 반환한다.
    // setList : chat_List의 목록을 주어진 값으로 갱신한다. => 따라서 목록의 리렌더링이 발생
    case "rec_message":
      console.log("rec_meesage : ", data);
      updateChat(updateChatData(data));
      setList(setListMessage(data.roomid, data.data_s));
      break;
    // 서버와 접속이 끊긴 동안 쌓인 데이터를 받는 경우
    // updateData_s 데이터를 로컬 저장소에 저장한다.
    // setListMessage : chatList에서 해당 방의 최신 메시지의 내용을 갱신한다. / chat_list를 반환한다.
    // 여러 데이터를 data 속성으로 받고 가장 마지막 데이터가 최신 메시지임으로 data.data.at(-1).data_s로 마지막 데이터에 접근한다.
    // setList : chat_List의 목록을 주어진 값으로 갱신한다. => 따라서 목록의 리렌더링이 발생
    case "rec_chatData":
      if (data.data !== 0) {
        updateData_s(data);
        setList(setListMessage(data.roomid, data.data.at(-1).data_s));
      }
      break;
    // 유저가 속한 방의 리스트를 받는 경우
    // setChatList : chat_list의 chat_list변수에 저장한다.
    // setList : 입력 값으로 chatList의 목록을 갱신한다. => 목록의 리렌더링이 발생
    case "rec_chatList":
      console.log("recChatList", data);
      setList(setChatList(data));
      break;
    // 유저가 속한 방이 만들어졌을 경우
    // addChat_list : 유저의 방목록에 추가한다.
    // setList : chatList의 목록을 갱신한다. => 목록의 리렌더링이 발생
    case "rec_createRoom":
      console.log("rec_create Room : ", data);
      setList(addChat_list(data));
      break;
    // 방에 속한 인원 중 누군가가 떠났을 경우
    // 추가 예정사항
    // chat_list 변수에 방에 속한 유저 리스트가 있다.
    // 이를 수정하여 다시 저장한다.
    // subUserChat_list 함수 사용
    case "rec_leaveRoom":
      console.log(data);
      break;
    // 방에 인원이 추가되었을 경우
    // 추가 예정사항
    // chat_list 변수에 방에 속한 유저 리스트가 있다.
    // 이를 수정하여 다시 저장한다.
    // addUserChat_list 함수 사용
    case "rec_addUser":
      console.log(data);
      break;
    // 이미 만들어진 방에 유저가 추가되었을 경우
    // 추가되는 유저만 받는 메시지 처리
    // createRoom 과 동일하게 작동한다.
    case "rec_addRoom":
      setList(addChat_list(data));
      break;
    default:
      break;
  }
}
