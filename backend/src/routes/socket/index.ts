import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {checkData, removeUserList, show_r, createRoom, updateRoom, getRoomData_name_user, setData_R, getData_R} from "@utils/ChatRoomUtils";
import {getUserRoomList, removeRoomList, updateRoomList, show_u, setData_U, getData_U} from "@utils/ChatUserUtils";
import {show_d, setData_D, getData_D} from "@utils/ChatDataUtils";
import {createRequire} from "module";
import {fileURLToPath} from "url";
import { Socket } from "socket.io";
import UserSession from "@utils/UserSession";
import { KURENTO_URI } from "@config/adam.config";
import kurento from "kurento-client";
/*
const job = schedule.scheduleJob("0 * * * * *", function () {
  save_Data();
  console.log("------------saveData----------");
});

const path_chatData = "";
const path_userData = "";
const path_roomData = "";

function save_Data() {
  fs.writeFileSync(path_chatData, JSON.stringify(getData_D()));
  fs.writeFileSync(path_userData, JSON.stringify(getData_U()));
  fs.writeFileSync(path_roomData, JSON.stringify(getData_R()));
}

function load_Data() {
  let data_chatData = fs.readFileSync(path_chatData);
  let data_userData = fs.readFileSync(path_userData);
  let data_roomData = fs.readFileSync(path_roomData);
  setData_D(JSON.parse(data_chatData));
  setData_U(JSON.parse(data_userData));
  setData_R(JSON.parse(data_roomData));
}
*/

interface Room {
  name: string;
  pipeline: any; // Replace 'any' with the actual type of pipeline
  participants: any; // Replace 'any' with the actual type of participants
  kurentoClient: any; // Replace 'any' with the actual type of kurentoClient
}

interface User {
  id: string;
  name: string;
}
const rooms: Record<string, Room> = {};
let userSessionList: any = {};
export default async function (fastify: FastifyInstance) {
  fastify.io.on("connection", (socket: any) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("data_init", (user_id: string) => {
      let index = user_list.findIndex((user: any) => user.user_id === user_id);
      if (index != -1) user_list[index].socket_id = socket.id;
      else user_list.push({user_id: user_id, socket_id: socket.id});
      console.log(user_list);

      let list = getUserRoomList(user_id);
      // 유저가 속한 방에 연결
      userJoin(socket, list);
      console.log("join_room_init");

      // 오프라인 일때 들어온 데이터 갱신
      for (let i = 0; i < list.length; i++) {
        let room_id = list[i].room_id;
        let data = checkData(room_id, user_id);
        fastify.io.to(socket.id).emit("rec_chatData", {room_id: room_id, data: data});
        console.log("rec_chatData : " + room_id + data);
      }

      // 유저가 속한 방 리스트
      console.log(list);
      console.log(make_RoomListData(list));
      fastify.io.to(socket.id).emit("rec_chatList", make_RoomListData(list));
    });

    socket.on("disconnect", (reason: any) => {
      let index = user_list.findIndex((user: any) => user.socket_id === socket.id);
      if (index == -1) {
        console.log("err : disconnect");
        return;
      }
      console.log("연결 종료 : " + user_list[index].userid);
      user_list.splice(index, 1);
      console.log("new user_list : " + user_list);
    });

    socket.on("leave_room", (data: any) => {
      socket.leave(data.room_id);
      removeRoomList(data.room_id, data.user_id);
      removeUserList(data.room_id, data.user_id);
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
    socket.on("add_user", () => {});
    socket.on("send_message", (datas: any) => {
      console.log(datas);
      console.log(socket.id);
      let {room_id, ...rest} = datas.message;
      let data = updateRoom(room_id, rest);
      // socket.broadcast.emit("receive_message", data); // 1 대 다수
      socket.to(room_id).emit("receive_message", data); // 방 하나만
      fastify.io.to(socket.id).emit("receive_message", data); // 특정 인원에게 전달 가능
    });
    //test
    socket.on("show_data", () => {
      show();
    });
    console.log("socket connected");

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    socket.on("message", (message: any) => {
      console.log(`Connection: ${socket.id} receive message: ${message.id}`);

      switch (message.id) {
        case "register":
          console.log(`Server: Register ${socket.id}`);
          register(socket, message.name || "", () => {});
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
/**
 * Register user to server
 * @param socket
 * @param name
 * @param callback
 */
function register(socket: Socket, name: string, callback: () => void) {
  const userSession = new UserSession(socket.id, name, socket);
  userSessionList[socket.id] = userSession;
  userSession.sendMessage({
    id: "registered",
    data: `Server: Successfully registered ${socket.id}`,
  });
}
function joinRoom(socket: Socket, roomName: string, callback: (error: any, user?: any) => void) {
  const room = getRoom(roomName, (error: any, room: any) => {
    if (error) {
      callback(error);
    }
  });
  join(socket, room, (error: Error | null, user: any) => {
    console.log("join success : " + user.id);
  });
}
function getRoom(roomName: string, callback: (error: any, room?: any) => void) {
  let room = rooms[roomName];

  if (room == null) {
    console.log("create new room : " + roomName);
    const kurentoClient = getKurentoClient(function (error: any, kurentoClient: any) {
      if (error) {
        return callback(error);
      }
      // create pipeline for room
      kurentoClient.create("MediaPipeline", (error: any, pipeline: any) => {
        if (error) {
          return callback(error);
        }
        pipeline.setLatencyStats();

        rooms[roomName] = room;
        callback(null, room);
      });
    });
  } else {
    console.log("get existing room : " + roomName);
    callback(null, room);
  }

  return room;
}
function join(socket: Socket, room: Room, callback: (error: any, user?: any) => void) {
  // create user session
  const userSession = userSessionList(socket.id);
  console.log("userSession is " + userSession);
  userSession.setRoomName(room.name);

  const outgoingMedia = room.pipeline.create("WebRtcEndpoint", (error: any, outgoingMedia: any) => {
    if (error) {
      console.error("no participant in room");
      // no participants in room yet, release pipeline
      if (Object.keys(room.participants).length == 0) {
        room.pipeline.release();
      }
      return callback(error);
    }
  });
  outgoingMedia.setMaxVideoSendBandwidth(10000);
  outgoingMedia.setMinVideoSendBandwidth(10000);
  userSession.outgoingMedia = outgoingMedia;

  // handle pre-established candidates before endpoint creation
  getIcecandidateBeforeEstablished(userSession, socket);

  userSession.outgoingMedia.on("OnIceCandidate", function (event: any) {
    console.log("generate outgoing candidate: " + userSession.id);
    // @ts-ignore
    const candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
    userSession.sendMessage({
      id: "iceCandidate",
      sessionId: userSession.id,
      candidate: candidate,
    });
  });

  // notify other users that a new user is joining
  const usersInRoom = room.participants;
  const data = {
    id: "newParticipantArrived",
    new_user_id: userSession.id,
  };

  // notify existing users
  for (const userId in usersInRoom) {
    usersInRoom[userId].sendMessage(data);
  }

  const existingUserIds = Object.keys(room.participants);
  // send the list of current users in the room to the current participant
  userSession.sendMessage({
    id: "existingParticipants",
    data: existingUserIds,
    roomName: room.name,
  });

  // register user to room
  room.participants[userSession.id] = userSession;
}
function getIcecandidateBeforeEstablished(userSession: UserSession, socket: Socket) {
  // add ice candidates that were sent before the endpoint is established
  const iceCandidateQueue = userSession.iceCandidateQueue[socket.id];
  if (iceCandidateQueue) {
    while (iceCandidateQueue.length) {
      const message = iceCandidateQueue.shift();
      console.error("user: " + userSession.id + " collect candidate for outgoing media");
      console.log("icecandidate per message: " + message);
      userSession.outgoingMedia.addIceCandidate(message.candidate);
    }
  }
}
function getKurentoClient(callback: any) {
  return kurento(KURENTO_URI);

var user_list: any = [];

function userJoin(socket: any, list: any) {
  console.log(list);
  for (let l = 0; l < list.length; l++) {
    socket.join(list[l].room_id);
  }
}

function make_RoomListData(list: any) {
  return list.map((data: any) => getRoomData_name_user(data.room_id));
}

function route_createRoom(io: any, data: any) {
  data.user_list.map((user: any) => {
    let tmp = user_list.find((socket: any) => socket.user_id === user.user_id);
    if (tmp) io.to(tmp.socket_id).emit("rec_create_room", data);
  });
}

// test
export function show() {
  show_d();
  show_r();
  show_u();
}
