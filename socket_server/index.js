import {checkData, removeUserList, show_r, updateRoom, getRoomData_name_user} from "./room_userList.js";
import {show_d} from "./data.js";
import {getUserRoomList,removeRoomList,updateRoomList, show_u} from "./user_roomList.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);


const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server,{
  cors : {
      origin :"*",
      credentials :true
  }
});

io.on('connection', socket=>{
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room_init", (user_id) => {
    userJoin(socket, user_id);
    console.log("join_room_init");
  });
  
  socket.on("data_init", (user_id)=>{
    let list = getUserRoomList(user_id);

    // 유저가 속한 방에 연결
    userJoin(socket, user_id);
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
  socket.on("create_room", (user_id) => {

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


server.listen(4000, function(){
    console.log('listening on port 4000');
})

// test
export function show(){ 
  show_d();
  show_r();
  show_u();
}