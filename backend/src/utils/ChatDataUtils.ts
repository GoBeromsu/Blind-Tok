import {type} from "os";

interface ChatData {
  roomid: string;
  roomdata: any;
}
// room_data 의 데이터 셋 추가 예정
interface room_d {}

var data: ChatData[] = [];

export function getData(roomid: string, datanum: number, opt: number) {
  let index: number = data.findIndex(data => data.roomid === roomid);
  let data_t: any;
  if (opt == 1) {
    data_t = data[index].roomdata;
    data[index].roomdata = data_t.filter((data: any) => data.num <= datanum);
  } else {
    data_t = data[index].roomdata.filter((data: any) => data.num > datanum);
  }
  console.log("getData");
  return data_t;
}

export function createData(roomid: string) {
  if (data.find(data => data.roomid === roomid)) return;
  let data_n: ChatData = {roomid: roomid, roomdata: []};
  data = [...data, data_n];
  console.log("createData : ");
  console.log(data);
}

export function setData(roomid: string, data_t: any) {
  let index: number = data.findIndex(data => data.roomid === roomid);
  if (index === -1) {
    createData(roomid);
    index = data.length - 1;
  }
  let roomdata_n: any;
  if (typeof data === "undefined" || data === null) data = [];
  else roomdata_n = data[index].roomdata;

  data[index] = {roomid: roomid, roomdata: [...roomdata_n, data_t]};
  console.log("setData : ");
  console.log(data);
}

export function getData_D() {
  return data;
}
export function setData_D(data_r: ChatData[]) {
  data = data_r;
}

// test
export function show_d() {
  console.log("data : ");
  console.log(data);
}
