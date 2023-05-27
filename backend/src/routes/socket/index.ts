import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {checkData, removeUserList, show_r, createRoom, updateRoom, getRoomData_name_user, setData_R, getData_R} from "@utils/ChatRoomUtils";
import {getUserRoomList, removeRoomList, updateRoomList, show_u, setData_U, getData_U} from "@utils/ChatUserUtils";
import {show_d, setData_D, getData_D} from "@utils/ChatDataUtils";
import {make_RoomListData, route_createRoom, show, userlist, userJoin, add_user, route} from "./chat";
import {register} from "./video";

export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("data_init", (userid: string) => {
      let index = userlist.findIndex((user: any) => user.userid === userid);
      if (!userid) return;
      if (index != -1) {
        if (userlist[index].socket === socket) return;
        userlist[index].socket = socket;
      } else userlist.push({userid: userid, socket: socket});

      let list = getUserRoomList(userid);
      // 유저가 속한 방에 연결
      userJoin(socket, list);
      //console.log(userlist);
      // 유저가 속한 방 리스트
      fastify.io.to(socket.id).emit("rec_message", {data : make_RoomListData(list), id:"rec_chatList"});
      // 오프라인 일때 들어온 데이터 갱신
      for (let i = 0; i < list.length; i++) {
        let roomid = list[i].roomid;
        let data = checkData(roomid, userid);
        fastify.io.to(socket.id).emit("rec_message", {data: {roomid: roomid, data: data}, id: "rec_chatData"});
        console.log("rec_chatData : " + roomid + data);
      }
    });

    socket.on("disconnect", (reason: any) => {
      let index = userlist.findIndex((user: any) => user.socketid === socket.id);
      if (index == -1) {
        return;
      }

      console.log(userlist);
      console.log("연결 종료 : " + userlist[index].userid);
      userlist.splice(index, 1);
      console.log("new user_list : " + userlist);
    });

    socket.on("leave_room", (roomid: string) => {
      socket.leave(roomid);
      let userid = userlist.find((user: any) => user.socket === socket).userid;
      removeRoomList(roomid, userid);
      removeUserList(roomid, userid);
      let list = getRoomData_name_user(roomid).userlist;
      if (list) route(fastify.io, list, "rec_leaveRoom", {roomid, userid});
      console.log("success leave / room : " + roomid + " / user : " + userid);
    });

    socket.on("create_room", (data: any) => {
      let tmp = [{userid: data.user.userid, nickname: data.user.nickname}, ...data.userlist];
      //console.log(data);
      let temp = createRoom(tmp, data.roomname);
      if (temp) {
        route_createRoom(fastify.io, temp);
      }
    });

    socket.on("add_user", (data: any) => {
      console.log("add_user");
      add_user(fastify.io, data);
    });

    socket.on("message", (datas: any) => {
      let {roomid, ...rest} = datas;
      let data = updateRoom(roomid + "", rest);
      // socket.broadcast.emit("receive_message", data); // 1 대 다수
      socket.to(roomid).emit("rec_message", {data: data, id: "rec_message"}); // 방 하나만
      fastify.io.to(socket.id).emit("rec_message", {data: data, id: "rec_message"}); // 특정 인원에게 전달 가능
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
