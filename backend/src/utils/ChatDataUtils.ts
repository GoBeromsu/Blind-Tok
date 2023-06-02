// room_data 의 데이터 셋 추가 예정
interface room_d {}

// 각 방의 데이터를 저장할 배열 변수
let chatRoomsData: {
  roomid: number;
  roomdata: any;
}[] = [];

// 데이터를 가져오고 저장된 데이터를 삭제하는 함수
// opt를 통해 1일 때는 데이터를 삭제하고 o일 때는 데이터만 가져온다.
// 이는 ChatRoomUtils에서 minnum 과 maxnum 그리고 userlist에 저장된 해당 유저의 num을 통해 판별한다.
// 만일 1이면 해당 방의 데이터를 data_t에 넣는다. / 1이라는 의미는 minnum을 num으로 가진 유저가 데이터를 요청했다는 의미
// 따라서 해당 방의 데이터 전체를 넘기고 다음 minnum까지의 데이터를 삭제한다.
// 0이면 minnum을 num으로 가진 유저가 아닌 다른 유저가 데이터를 요청했기 때문에 유저의 num == datanum 보다 큰 데이터만 간추려서 반환하면 된다.
export function getData(roomid: number, datanum: number, opt: number) {
  let roomIndex: number = chatRoomsData.findIndex(data => data.roomid === roomid);
  let temporaryData: any;
  if (opt == 1) {
    temporaryData = chatRoomsData[roomIndex].roomdata;
    chatRoomsData[roomIndex].roomdata = temporaryData.filter((data: any) => data.num <= datanum);
  } else {
    temporaryData = chatRoomsData[roomIndex].roomdata.filter((data: any) => data.num > datanum);
  }
  return temporaryData;
}

// 새로운 방의 데이터 공간을 만드는 함수
// 동일한 방 아이디가 있으면 종료
// 없다면 방 아이디와 데이터를 저장할 객체를 만들고 이를 데이터에 저장
export function createData(roomid: number) {
  if (chatRoomsData.find(data => data.roomid === roomid)) return;
  let newData: {
    roomid: number;
    roomdata: any;
  } = {roomid: roomid, roomdata: []};
  chatRoomsData = [...chatRoomsData, newData];
}

// 데이터를 저장하는 함수
// 해당 방의 인덱스를 찾는다.
// 해당 방이 없다면 방을 만들고 인덱스를 조정한다.
// 그리고 데이터를 해당 방의 roomdata에 추가한다.
export function setData(roomid: number, data_t: any) {
  let index: number = chatRoomsData.findIndex(data => data.roomid == roomid);
  if (index == -1) {
    createData(roomid);
    index = chatRoomsData.length - 1;
  }
  // 빈 배열일 경우 생기는 문제를 해결하기 위한 코드
  let roomdata_n: any;
  if (typeof chatRoomsData === "undefined" || chatRoomsData === null) chatRoomsData = [];
  else roomdata_n = chatRoomsData[index].roomdata;

  chatRoomsData[index] = {roomid: roomid, roomdata: [...roomdata_n, data_t]};
}
