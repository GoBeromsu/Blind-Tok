import {type} from "os";

interface ChatData {
  room_id: string;
  room_data: any;
}
// room_data 의 데이터 셋 추가 예정
interface room_d {}

var data: ChatData[] = [];

export function getData(room_id: string, data_num: number, opt: number) {
  let index: number = data.findIndex(data => data.room_id === room_id);
  let data_t: any;
  if (opt == 1) {
    data_t = data[index].room_data;
    data[index].room_data = data_t.filter((data: any) => data.num <= data_num);
  } else {
    data_t = data[index].room_data.filter((data: any) => data.num > data_num);
  }
  console.log("getData");
  return data_t;
}

export function createData(room_id: string) {
  if (data.find(data => data.room_id === room_id)) return;
  let data_n: ChatData = {room_id: room_id, room_data: []};
  data = [...data, data_n];
  console.log("createData : ");
  console.log(data);
}

export function setData(room_id: string, data_t: any) {
  let index: number = data.findIndex(data => data.room_id === room_id);
  if (index === -1) {
    createData(room_id);
    index = data.length - 1;
  }
  let room_data_n: any;
  if (typeof data === "undefined" || data === null) data = [];
  else room_data_n = data[index].room_data;

  data[index] = {room_id: room_id, room_data: [...room_data_n, data_t]};
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
