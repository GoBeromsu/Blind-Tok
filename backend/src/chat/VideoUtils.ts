import kurento from "kurento-client";
import {KURENTO_URI} from "@config/adam.config";
import {rooms, sendMessage, userRegistry} from "./Consonants";

import {Socket} from "socket.io";
import UserSession from "./UserSession";

export async function joinVideoChat(socket: any, roomid: number, userlist: any) {
  // console.log("joinVideoChat : ", roomid, userlist);
  const userSession = userRegistry.getBySocket(socket?.id);
  // console.log("userSession : ", userSession, socket.id);
  const room = await setRoomPipeline(roomid);
  // console.log("room : ", room);
  let outgoingMedia = await room.pipeline.create("WebRtcEndpoint", (error: any, outgoingMedia: any) => {
    if (error) {
      console.error("no participant in room");
      // no participants in room yet, release pipeline
      if (Object.keys(room.participants).length == 0) {
        room.pipeline.release();
      }
    }
  });
  // console.log("outgoingMedia : ", outgoingMedia);
  await outgoingMedia.setMaxVideoSendBandwidth(1000);
  await outgoingMedia.setMinVideoSendBandwidth(1000);
  userSession.outgoingMedia = outgoingMedia;

  getIcecandidateBeforeEstablished(userSession, socket);

  userSession.outgoingMedia.on("IceCandidateFound", (event: any) => {
    console.log("generate outgoing candidate: " + userSession.userid, event);

    // @ts-ignore
    const candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
    //TODO: 클라 단에서 icecandidate 처리할 함수 추가해야 함
    sendMessage(socket, {
      id: "iceCandidate",
      data: {
        sessionId: userSession.userid,
        candidate: candidate,
      },
    });
  });

  //TODO: 클라 단에서 newParticipantArrived 처리할 함수 추가해야 함
  // Pariticpant에[ 지금 데이터 저장하는게 없음 ㅋㅋ
  const usersInRoom = room.participants; // 방 안의 유저들을 불러온다
  // usersInRoom.map((user: any) => {
  //   sendMessage(user.socket, {
  //     id: "newParticipantArrived",
  //     new_user_id: userSession.userid,
  //   });
  // });
  Object.values(room.participants).forEach((user: any) => {
    sendMessage(user.socket, {
      id: "newParticipantArrived",
      new_user_id: user.userid,
    });
  });

  room.participants[userSession.userid] = userSession;
  // console.log(room.participants);
}

export async function setRoomPipeline(roomid: number) {
  let room = rooms[roomid];
  if (room) {
    const kurentoClient = await getKurentoClient();
    room.pipeline = kurentoClient.create("MediaPipeline");
    room.kurentoClient = kurentoClient;
    room.participants = {}; //필요 없긴 함
  } else {
    console.log("setRoomPipeline : room is null");
  }
  // console.log("setRoomPipeline : ", room);
  return room;
}
export function getIcecandidateBeforeEstablished(userSession: UserSession, socket: Socket) {
  // add ice candidates that were sent before the endpoint is established
  const iceCandidateQueue = userSession.iceCandidateQueue[socket.id];
  if (iceCandidateQueue) {
    while (iceCandidateQueue.length) {
      const message = iceCandidateQueue.shift();
      console.error("user: " + userSession.userid + " collect candidate for outgoing media");
      console.log("icecandidate per enteredMessage: " + message);
      userSession.outgoingMedia.addIceCandidate(message.candidate);
    }
  }
}
export function getKurentoClient() {
  const kurentoClient = kurento(KURENTO_URI);
  if (!kurentoClient) {
    console.log("kurentoClient is null");
  }
  return kurentoClient;
}
