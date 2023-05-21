import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {checkData, removeUserList, show_r, createRoom, updateRoom, getRoomData_name_user, setData_R, getData_R} from "@utils/ChatRoomUtils";
import {getUserRoomList, removeRoomList, updateRoomList, show_u, setData_U, getData_U} from "@utils/ChatUserUtils";
import {show_d, setData_D, getData_D} from "@utils/ChatDataUtils";
import {make_RoomListData, route_createRoom, show, user_list, userJoin} from "./chat";
import {register} from "./video";

export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("data_init", (user_id: string) => {
      let index = user_list.findIndex((user: any) => user.user_id === user_id);
      if (!user_id) return;
      if (index != -1) user_list[index].socket_id = socket.id;
      else user_list.push({user_id: user_id, socket_id: socket.id});
      console.log("connect - user_list : ");
      console.log(user_list);

      let list = getUserRoomList(user_id);
      // 유저가 속한 방에 연결
      userJoin(socket, list);
      console.log("join_room_init");

      // 오프라인 일때 들어온 데이터 갱신
      for (let i = 0; i < list.length; i++) {
        let roomid = list[i].room_id;
        let data = checkData(roomid, user_id);
        fastify.io.to(socket.id).emit("rec_chatData", {room_id: roomid, data: data});
        console.log("rec_chatData : " + roomid + data);
      }

      // 유저가 속한 방 리스트
      fastify.io.to(socket.id).emit("rec_chatList", make_RoomListData(list));
    });

    socket.on("disconnect", (reason: any) => {
      let index = user_list.findIndex((user: any) => user.socket_id === socket.id);
      if (index == -1) {
        return;
      }

      console.log(user_list);
      console.log("연결 종료 : " + user_list[index].user_id);
      user_list.splice(index, 1);
      console.log("new user_list : " + user_list);
    });

    socket.on("leave_room", (room_id: string) => {
      socket.leave(room_id);
      let tmp = user_list.find((user: any) => user.socket_id === socket.id);
      removeRoomList(room_id, tmp.user_id);
      removeUserList(room_id, tmp.user_id);
      console.log("success leave / room : " + room_id + " / user : " + tmp.user_id);
    });

    socket.on("get_UserRoomList", (user_id: string) => {
      fastify.io.to(socket.id).emit("rec_chatList", getUserRoomList(user_id));
    });

    socket.on("create_room", (data: any) => {
      let tmp = [{user_id: data.user.userid, nickname: data.user.nickname}, ...data.user_list];
      console.log(data);
      let temp = createRoom(tmp, data.room_name);
      if (temp) route_createRoom(fastify.io, temp);
    });

    socket.on("add_user", (data: any) => {});

    socket.on("send_message", (datas: any) => {
      console.log(datas);
      console.log(socket.id);
      let {room_id, ...rest} = datas.message;
      let data = updateRoom(room_id + "", rest);
      // socket.broadcast.emit("receive_message", data); // 1 대 다수
      socket.to(room_id).emit("receive_message", data); // 방 하나만
      fastify.io.to(socket.id).emit("receive_message", data); // 특정 인원에게 전달 가능
    });
    //test
    socket.on("show_data", () => {
      show();
    });
    console.log("socket connected");

    socket.on("message", (message: any) => {
      console.log(`Connection: ${socket.id} receive message: ${message.id}`);

      switch (message.id) {
        case "register":
          console.log(`Server: Register ${socket.id}`);
          register(socket, message?.name || "", () => {});
          break;
        case "joinRoom":
          console.log(`Server: ${socket.id} joinRoom: ${message.roomName}`);
          // joinRoom(socket, message.roomName || "", () => {});
          break;
        // case "receiveVideoFrom":
        //   console.log(`${socket.id} receiveVideoFrom: ${message.sender}`);
        //   receiveVideoFrom(socket, message.sender || "", message.sdpOffer || "", () => {});
        //   break;
        // case "leaveRoom":
        //   console.log(`${socket.id} leaveRoom`);
        //   leaveRoom(socket.id);
        //   break;
        // case "onIceCandidate":
        //   addIceCandidate(socket, message);
        //   break;
        // default:
        //   socket.emit("error", {id: "error", message: `Invalid message ${message}`});
      }
    });
  });
}
