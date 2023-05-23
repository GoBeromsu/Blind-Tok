import {setListMessage} from './chat_list';
/*
my Arr[
    {
        room_id: 1,
        last_massage: "",
        data: [{
            num : 1,
            user_id : "choichoichoi",
            user_nickname : "최승주",
            time : "00-00-00",
            data_s : "안녕하세요.안녕하세요.안녕하세요.",
        }],
    },
]
*/

// 지역저장소에서 데이터 가져오기
function getData(key: string): any {
  let myArr: any = localStorage.getItem(key);
  if (myArr == null) {
    //myArr = [];
  } else {
    myArr = JSON.parse(myArr);
  }
  return myArr;
}

// 데이터 수정 및 저장 / 단일 데이터
export function updateChatData(data: any): any {
  let {room_id, ...rest} = data;
  setListMessage(room_id, data.data_s);
  let tmp = getData("chatData");
  if (!tmp) {
    updateData("chatData", [{room_id: room_id, data: [rest]}]);
  } else {
    let index = tmp.findIndex((p: any) => p.room_id === room_id);
    let tmp_n;
    if (index == -1) {
      tmp = [{room_id: room_id, data: [rest]}, ...tmp];
    } else {
      tmp_n = tmp.splice(index,1);
      tmp_n[0].data.unshift(rest);
      tmp.unshift(tmp_n[0]);
    }
    console.log(tmp);
    updateData("chatData", tmp);
  }
  return data;
}

// 지역 저장소에 데이터 저장
function updateData(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// 여러 데이터 저장
export function updateData_s(data: any): void {
  if (!data) return;
  let {room_id, ...rest} = data;
  setListMessage(room_id, rest.data[-1].data_s);
  let tmp = getData("chatData");
  if (!tmp) {
    updateData("chatData", [data]);
  } else {
    let tmp_f = tmp.find((p: any) => p.room_id === room_id);
    if (!tmp_f) {
      console.log(data);
      tmp_f = [...tmp, data];
    } else {
      tmp_f = tmp.map((chat_data: any) => (chat_data.room_id === room_id ? {room_id: room_id, data: [...tmp_f.data, ...rest]} : chat_data));
    }
    console.log(tmp_f);
    updateData("chatData", tmp_f);
  }
}

export function getChatData(id: any): any {
  let tmp = getData("chatData");
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();
  let day = "일";
  switch (today.getDay()) {
    case 0:
      break;
    case 1:
      day = "월";
      break;
    case 2:
      day = "화";
      break;
    case 3:
      day = "수";
      break;
    case 4:
      day = "목";
      break;
    case 5:
      day = "금";
      break;
    case 6:
      day = "토";
      break;
  }
  let data: any = {
    num: 0,
    user_id: "",
    user_nickname: "",
    time: "",
    data_s: `${year}년 ${month}월 ${date}일 ${day}요일`,
  };

  if (!tmp) {
    console.log({id, data});
    return {room_id: id, data: [data]};
  }

  let tmp_f = tmp.find((p: any) => p.room_id === id);
  if (!tmp_f) {
    return {room_id: id, data: [data]};
  } else {
    return tmp_f;
  }
}
export function subData(room_id:string, user_id:string){
  let tmp = getData("chatData");
  let temp;
  if (!tmp) {
    return;
  } else {
    let index = tmp.findIndex((p: any) => p.room_id === room_id);
    if (index == -1) {
      return;
    } else {
      temp = tmp.splice(index,1);
    }
    console.log("delete data : " + temp);
    updateData("chatData", tmp);
  }
}
