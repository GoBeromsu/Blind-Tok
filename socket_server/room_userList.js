import {updateRoomList} from "./user_roomList.js";
import {createData, getData, setData} from "./data.js";

var data =[]

export function createRoom(room_id, user_list, room_name){
    if(data.find((data)=>data.room_id === room_id)) {console.log("err(createRoom : room_id)"); return;}
    let tmp = data;
    // 같은 인원을 가진 방은 만들지 않는다.
    for(let i = 0; i < user_list.length; i++){
        tmp = tmp.filter((room)=>room.user_list.find((user)=> user.user_id === user_list[i].user_id) ? true : false)
    }
    if(tmp.length > 0) {console.log("err(createRoom : user)"); return ;}

    let str = user_list[0].user_id;
    if(room_name == ""){
        for(let i = 1; i < user_list.length; i++){
            str += ", " + user_list[i].user_id;
        }
    }else str = room_name;

    let data_n = {
        room_id : room_id,
        room_name : str,
        min_num : 0,
        max_num : 0,
        user_list : user_list.map((user) => {return {user_id : user.user_id, data_num : 0}}),
    };
    data = [...data, data_n];
    updateRoomList(room_id, user_list);
    createData(room_id);
    console.log("success createRoom");
}
/*
export function checkData(room_id, user_id, data_num){
    let room_data = data.find((data) => data.room_id === room_id);
    let data_n;
    let min = room_data.min_num;
    let max = room_data.max_num;
    if(max === data_num) return 0;
    if(min === data_num){
        let user_data = room_data.user_list.find((user) => user.user_id === user_id);
        user_data.data_num = max;
        let min_Arr = room_data.user_list.reduce( (prev, value) => {
            return prev.data_num < value.data_num ? prev : value
        });
        data_n = getData(room_id, data_num - min, min_Arr.data_num - min);
    }else{
        data_n = getData(room_id, data_num - min);
    }
    return data_n;
};
*/

// 서버와 접속이 끊긴 동안의 채팅 내역을 가져오는 함수
export function checkData(room_id, user_id){ 
    let index = data.findIndex((data) => data.room_id === room_id);
    let room_data = data[index];
    let data_n;
    let min = room_data.min_num;
    let max = room_data.max_num;
    let user_data = room_data.user_list.find((user) => user.user_id === user_id);
    if(max === user_data.data_num || !user_data) return 0; // 추가 내용 없음
    else if(min === user_data.data_num){
        user_data.data_num = max;
        let min_Arr = room_data.user_list.reduce( (prev, value) => {
            return prev.data_num < value.data_num ? prev : value;
        });
        data[index].min_num = min_Arr.data_num;
        data_n = getData(room_id, min_Arr.data_num, 1);
        console.log("test1");
        console.log(user_data);
    }else{
        data_n = getData(room_id, user_data.data_num - min, 0);
        console.log("test2");
    }
    return data_n;
};

export function updateRoom(room_id, rest){
    let index = data.findIndex((data) => data.room_id === room_id);
    let num = data[index].max_num + 1;
    data[index].max_num = num;
    rest = {num: num, ...rest};
    setData(room_id, rest);
    return {room_id: room_id, ...rest};
}

export function removeUserList(room_id, user_id){
    let room = data.find((data) => data.room_id === room_id);
    room.user_list = room.user_list.filter((user) => user.user_id != user_id);
    data = data.map((data) => data.room_id === room_id ? room : data);
};

export function getData_R(){
    return data;
}
export function setData_R(data_r){
    data = data_r;
}

export function getRoomData_name_user(room_id){
    let room = data.find((data) => data.room_id === room_id);
    if(!room) return {};
    return {room_id: room_id, room_name: room.room_name, user_list: room.user_list.map((data)=> {return {user_id : data.user_id}})};
}

// test
export function show_r(){ 
    console.log("room_userList : ");
    console.log(data)
}