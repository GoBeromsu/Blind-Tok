import io from "socket.io-client";
import { updateChat } from "./ChatRoom";
import { setChatList } from "../../data/chat_list";
import { rec, updateData_s } from '../../data/chat_data';

var socket = io.connect("");

export function createSocket(add = ""){
    if(add === ""){
        socket = io.connect("http://localhost:4000");
    }else{
        socket = io.connect(add);
    }

    // data = {room_id, data = {}}
    // 저장은 chat_data.js의 rec에서 처리
    // 출력은 chatRoom.js의 updataChat에서 처리
    socket.on("receive_message", (data) => {
        console.log(data);
        updateChat(rec(data));
    });

    socket.on("update_roomList", (data) =>{

    });

    // data = {room_id, data = [{}]}
    // 저장은 chat_data.js의 updateData_s에서 처리
    socket.on("rec_chatData", (data) =>{
        if(data.data != 0){
            updateData_s(data);
            console.log(data);
        }
    })

    socket.on("rec_chatList", (data) =>{
        setChatList(data);
        console.log(data);
    })

    console.log(socket);
}

export function getSocket(){
    return socket;
}

export function createRoom(user, user_list, room_name = ""){
    socket.emit("create_room", {user, user_list, room_name});
}

export function addUser(user_id){
    socket.emit("add_user", {user_id});
}

export function sendMessage(data){
    socket.emit("send_message", { message: data });
    socket.emit("show_data", ); // test
}

export function getChatList(user_id){
    socket.emit("get_UserRoomList", user_id);
}


