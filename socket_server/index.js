import {checkData, removeUserList, show_r, createRoom, updateRoom, getRoomData_name_user, setData_R, getData_R} from "./room_userList.js";
import {getUserRoomList,removeRoomList,updateRoomList, show_u, setData_U, getData_U} from "./user_roomList.js";
import {show_d, setData_D, getData_D} from "./data.js";
import { createRequire } from "module";
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);

const schedule = require('node-schedule');

const job = schedule.scheduleJob('0 * * * * *', function(){
  save_Data();
  console.log("------------saveData----------")
});


// 파일 저장 - data/ --- .json
const fs = require('fs');
const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const path_chatData = path.join(__dirname, 'data', 'chatData.json');
const path_userData = path.join(__dirname, 'data', 'user_roomData.json');
const path_roomData = path.join(__dirname, 'data', 'room_userData.json');

function save_Data(){
  fs.writeFileSync(path_chatData, JSON.stringify(getData_D()));
  fs.writeFileSync(path_userData, JSON.stringify(getData_U()));
  fs.writeFileSync(path_roomData, JSON.stringify(getData_R()));
}

function load_Data(){
  let data_chatData = fs.readFileSync(path_chatData);
  let data_userData = fs.readFileSync(path_userData);
  let data_roomData = fs.readFileSync(path_roomData);
  setData_D(JSON.parse(data_chatData));
  setData_U(JSON.parse(data_userData));
  setData_R(JSON.parse(data_roomData));
}


const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server,{
  cors : {
      origin :"*",
      credentials :true
  }
});

var user_list = [];

load_Data();

io.on('connection', socket=>{
  console.log(`User Connected: ${socket.id}`);
  
  socket.on("data_init", (user_id)=>{
    let index = user_list.findIndex((user) => user.user_id === user_id);
    if(index != -1) user_list[index].socket_id = socket.id;
    else user_list.push({user_id: user_id, socket_id: socket.id});
    console.log(user_list);
    
    let list = getUserRoomList(user_id);
    // 유저가 속한 방에 연결
    userJoin(socket, list);
    console.log("join_room_init");

    // 오프라인 일때 들어온 데이터 갱신
    for(let i = 0; i < list.length; i++){
      let room_id = list[i].room_id;
      let data = checkData(room_id, user_id);
      io.to(socket.id).emit("rec_chatData", {room_id : room_id, data: data});
      console.log("rec_chatData : " + room_id + data);
    }

    // 유저가 속한 방 리스트 
    console.log(list);
    console.log(make_RoomListData(list));
    io.to(socket.id).emit("rec_chatList", make_RoomListData(list));
    
  })

  socket.on("disconnect", (reason) => {
    let index = user_list.findIndex((user)=> user.socket_id === socket.id);
    if(index == -1){console.log("err : disconnect"); return;};
    console.log("연결 종료 : " + user_list[index].userid);
    user_list.splice(index,1);
    console.log("new user_list : " + user_list);
  })
  
  // data = {room_id : , user_id :}
  socket.on("join_room", (user_id) => {

  })
  socket.on("leave_room", (data) => {
    socket.leave(data.room_id);
    removeRoomList(data.room_id, data.user_id);
    removeUserList(data.room_id, data.user_id);
  });
  socket.on("get_UserRoomList", (user_id) => {
    io.to(socket.id).emit("rec_chatList", getUserRoomList(user_id));
  })
  socket.on("create_room", (data) => {
    let tmp = [{user_id: data.user.userid, nickname: data.user.nickname}, ...data.user_list]
    console.log(data);
    let temp = createRoom(tmp,data.room_name);
    if(temp) route_createRoom(temp);
  })
  socket.on("add_user", ()=>{

  })
  socket.on("send_message", (datas) => {
    console.log(datas);
    console.log(socket.id);
    let {room_id, ...rest} = datas.message;
    let data = updateRoom(room_id, rest);
    // socket.broadcast.emit("receive_message", data); // 1 대 다수
    socket.to(room_id).emit("receive_message", data); // 방 하나만
    io.to(socket.id).emit("receive_message", data); // 특정 인원에게 전달 가능
    
  });
  //test
  socket.on("show_data", ()=>{
    show();
  })
})

function userJoin(socket, list){
  console.log(list);
  for(let l = 0; l < list.length; l++ ){
    socket.join(list[l].room_id);
  }
}

function make_RoomListData(list){
  return list.map((data) => getRoomData_name_user(data.room_id));
}

function route_createRoom(data){
  data.user_list.map((user)=>{
    let tmp = user_list.find((socket) => socket.user_id === user.user_id);
    if(tmp) io.to(tmp.socket_id).emit("rec_create_room", data);
  });
}


server.listen(4001, function(){
    console.log('listening on port 4001');
})

// test
export function show(){ 
  show_d();
  show_r();
  show_u();
}