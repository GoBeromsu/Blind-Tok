var localStorageName: string = "chatData";

// 지역저장소에서 데이터 가져오기
// key값을 통해 저장된 데이터를 불러오고
// 불러온 데이터가 string이기 때문에 parse를 통해 전환해줘야된다.
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
// 데이터를 roomid 와 나머지 rest로 나누어 다룬다.
// 만일 key = 'chatData'로 저장된 데이터가 없다면
// 현재 데이터를 로컬 저장소에 저장한다.
// 만일 데이터가 존재하지만 해당 방에 대한 정보가 없다면
// 해당 방의 정보를 가장 앞에 추가한다. => 방을 시간 순서로 정렬
// 마지막으로 데이터가 존재하면서 해당 방의 정보도 있다면
// 해당 방의 정보를 가져와서 받은 데이터를 추가하고 다시 저장한다.
export function updateChatData(datas: any): any {
  let roomid = datas.roomid;
  let rest = {data_s: datas.data_s, nickname: datas.nickname, time: datas.time, userid: datas.userid};
  let savedata = getData(localStorageName);
  if (!savedata) {
    updateData(localStorageName, [{roomid: roomid, data: [rest]}]);
  } else {
    let index = savedata.findIndex((p: any) => p.roomid === roomid);
    let data_n;
    if (index == -1) {
      savedata = [{roomid: roomid, data: [rest]}, ...savedata];
    } else {
      data_n = savedata.splice(index, 1);
      if (data_n[0].data) data_n[0].data?.push(rest);
      else data_n[0] = {...data_n[0], data: [rest]};
      savedata.unshift(data_n[0]);
    }
    updateData(localStorageName, savedata);
  }
  return {roomid: roomid, data: rest};
}

// 지역 저장소에 데이터 저장
function updateData(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// 여러 데이터 저장
// updateChatData와 동일하게 경우를 나누고 똑같이 진행
// 다만 데이터가 한개가 아닌 여러개를 가진 배열을 저장하는 것임으로 저장 부분만 다르다.
export function updateData_s(datas: any): void {
  if (!datas || !datas.data) return;
  console.log(datas);
  let {roomid, data} = datas;
  let savedata = getData(localStorageName);
  if (!savedata) {
    updateData(localStorageName, [{roomid: roomid, data: data}]);
  } else {
    let index = savedata.findIndex((p: any) => p.roomid === roomid);
    if (index == -1) {
      savedata = [{roomid: roomid, data: data}, ...savedata];
    } else {
      savedata[index].data = [...savedata[index].data, ...data];
    }
    //console.log(tmp_f);
    updateData(localStorageName, savedata);
  }
}

// 해당 방의 데이터를 가져오는 함수
// 날짜와 data 변수는 삭제 예정
// 이는 처음 방만들때 서버에서 data 변수가 자동으로 생성 저장되고 이를 클라이언트에 뿌려야됨 / 현재는 그냥 임시용
// 로컬 저장소에서 데이터를 찾고 없을 때
// 데이터는 있지만 방에 대한 정보가 없을 때
// 데이터도 있고 방에 대한 정보도 있을 때로 나누어 진행
// 이도 수정이 필요, 서버가 data 변수를 방만들때 뿌리면 데이터가 없을 수가 없음
// 마지막 경우만 처리하면됨. / data 변수란 이 함수에 있는 data 변수를 의미함
export function getChatData(roomid: number): any {
  let savedata = getData(localStorageName);
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
    userid: "",
    usernickname: "",
    time: "",
    data_s: `${year}년 ${month}월 ${date}일 ${day}요일`,
  };

  if (!savedata) {
    // console.log(roomid, data);
    return {roomid: roomid, data: [data]};
  }

  savedata = savedata.find((p: any) => p.roomid === roomid);
  if (!savedata) {
    return {roomid: roomid, data: [data]};
  } else {
    return savedata;
  }
}

// 방을 나갈 때 해당 방의 데이터를 삭제하는 함수
// 로컬 저장소에서 데이터를 가져온다.
// 해당 방의 정보를 찾는다. 없으면 종료
// 찾으면 해당 데이터 삭제, 그후 다시 저장
export function subData(roomid: number) {
  let savedata = getData(localStorageName);
  if (!savedata) {
    return;
  } else {
    let index = savedata.findIndex((p: any) => p.roomid === roomid);
    if (index == -1) {
      return;
    } else {
      savedata.splice(index, 1);
    }
    console.log("delete data : " + roomid);
    updateData(localStorageName, savedata);
  }
}

export function setLocalStorageName(name: string) {
  localStorageName = name;
}
