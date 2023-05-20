import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import UserSession from "@utils/UserSession";
import userRegistry from "@utils/UserRegistry";
import {Socket} from "socket.io";
import kurento from "kurento-client";
import {KURENTO_URI} from "@config/adam.config";

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
    socket.on("error", (err: any) => {
      console.log("socket error", err);
    });
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
}
