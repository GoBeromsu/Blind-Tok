import kurento from "kurento-client";
import {KURENTO_URI} from "@config/adam.config";
import {Socket} from "socket.io";
import UserSession from "@utils/UserSession";

interface Room {
  name: string;
  pipeline: any; // Replace 'any' with the actual type of pipeline
  participants: any; // Replace 'any' with the actual type of participants
  kurentoClient: any; // Replace 'any' with the actual type of kurentoClient
}
export let rooms: Record<string, Room> = {};
export let userSessionList: any = {};
export function getKurentoClient(callback: any) {
  return kurento(KURENTO_URI);
}
export function join(socket: Socket, room: Room, callback: (error: any, user?: any) => void) {
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
export function getIcecandidateBeforeEstablished(userSession: UserSession, socket: Socket) {
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
/**
 * Register user to server
 * @param socket
 * @param name
 * @param callback
 */
export function register(socket: Socket, name: string, callback: () => void) {
  const userSession = new UserSession(socket.id, name, socket);
  userSessionList[socket.id] = userSession;
  userSession.sendMessage({
    id: "registered",
    data: `Server: Successfully registered ${socket.id}`,
  });
}

export function getRoom(roomName: string, callback: (error: any, room?: any) => void) {
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
export function joinRoom(socket: Socket, roomName: string, callback: (error: any, user?: any) => void) {
  const room = getRoom(roomName, (error: any, room: any) => {
    if (error) {
      callback(error);
    }
  });
  join(socket, room, (error: Error | null, user: any) => {
    console.log("join success : " + user.id);
  });
}
function leaveRoom(sessionId: any, callback: any) {
  const userSession = userSessionList[sessionId];

  if (!userSession) {
    return;
  }

  let room = rooms[userSession.roomName];

  if (!room) {
    return;
  }

  console.log("notify all user that " + userSession.id + " is leaving the room " + room.name);
  let usersInRoom = room.participants;
  delete usersInRoom[userSession.id];
  userSession.outgoingMedia.release();
  // release incoming media for the leaving user
  for (let i in userSession.incomingMedia) {
    userSession.incomingMedia[i].release();
    delete userSession.incomingMedia[i];
  }

  var data = {
    id: "participantLeft",
    sessionId: userSession.id,
  };
  for (let i in usersInRoom) {
    let user = usersInRoom[i];
    // release viewer from this
    user.incomingMedia[userSession.id].release();
    delete user.incomingMedia[userSession.id];

    // notify all user in the room
    user.sendMessage(data);
  }

  // Release pipeline and delete room when room is empty
  if (Object.keys(room.participants).length == 0) {
    room.pipeline.release();
    delete rooms[userSession.roomName];
  }
  delete userSession.roomName;
}
/**
 * Unregister user
 * @param sessionId
 */
// function stop(sessionId:any) {
// userRegistry.unregister(sessionId);
// }
/**
 * Retrieve sdpOffer from other user, required for WebRTC calls
 * @param socket
 * @param senderId
 * @param sdpOffer
 * @param callback
 */
function receiveVideoFrom(socket: Socket, senderId: any, sdpOffer: any, callback: any) {
  let userSession = userSessionList[socket.id];
  let sender = userSessionList[socket.id];

  getEndpointForUser(userSession, sender, function (error: any, endpoint: any) {
    if (error) {
      callback(error);
    }

    endpoint.processOffer(sdpOffer, function (error: any, sdpAnswer: any) {
      console.log("process offer from : " + senderId + " to " + userSession.id);
      if (error) {
        return callback(error);
      }
      var data = {
        id: "receiveVideoAnswer",
        sessionId: sender.id,
        sdpAnswer: sdpAnswer,
      };
      userSession.sendMessage(data);

      endpoint.gatherCandidates(function (error: any) {
        if (error) {
          return callback(error);
        }
      });
      return callback(null, sdpAnswer);
    });
  });
}

/**
 * Get user WebRTCEndPoint, Required for WebRTC calls
 * @param userSession
 * @param sender
 * @param callback
 */
function getEndpointForUser(userSession: any, sender: any, callback: any) {
  // request for self media
  if (userSession.id === sender.id) {
    callback(null, userSession.outgoingMedia);
    return;
  }

  var incoming = userSession.incomingMedia[sender.id];
  if (incoming == null) {
    // console.log(
    //   "user : " +
    //   userSession.id +
    //   " create endpoint to receive video from : " +
    //   sender.id
    // );
    getRoom(userSession.roomName, function (error, room) {
      if (error) {
        return callback(error);
      }
      room.pipeline.create("WebRtcEndpoint", (error: any, incomingMedia: any) => {
        if (error) {
          // no participants in room yet release pipeline
          if (Object.keys(room.participants).length == 0) {
            room.pipeline.release();
          }
          return callback(error);
        }
        // console.log(
        //   "user : " + userSession.id + " successfully created pipeline"
        // );

        incomingMedia.getStats("AUDIO", (error: any, statsMap: any) => {
          if (error) {
            return callback(error);
          } else {
            console.log(statsMap);
          }
        });
        incomingMedia.setMaxVideoSendBandwidth(100);
        incomingMedia.setMinVideoSendBandwidth(100);
        userSession.incomingMedia[sender.id] = incomingMedia;

        // add ice candidate the get sent before endpoint is established
        let iceCandidateQueue = userSession.iceCandidateQueue[sender.id];
        if (iceCandidateQueue) {
          while (iceCandidateQueue.length) {
            let message = iceCandidateQueue.shift();
            console.log("user : " + userSession.id + " collect candidate for : " + message.data.sender);
            incomingMedia.addIceCandidate(message.candidate);
          }
        }

        incomingMedia.on("OnIceCandidate", function (event: any) {
          console.log("generate incoming media candidate : " + userSession.id + " from " + sender.id);
          //@ts-ignore
          let candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
          userSession.sendMessage({
            id: "iceCandidate",
            sessionId: sender.id,
            candidate: candidate,
          });
        });
        sender.outgoingMedia.connect(incomingMedia, function (error: any) {
          if (error) {
            callback(error);
          }
          callback(null, incomingMedia);
        });
      });
    });
  } else {
    console.log("user : " + userSession.id + " get existing endpoint to receive video from : " + sender.id);
    sender.outgoingMedia.connect(incoming, function (error: any) {
      if (error) {
        callback(error);
      }
      callback(null, incoming);
    });
  }
}

/**
 * Add ICE candidate, required for WebRTC calls
 * @param socket
 * @param message
 */
function addIceCandidate(socket: any, message: any) {
  let user = userSessionList[socket.id];
  if (user != null) {
    // assign type to IceCandidate
    // @ts-ignore
    let candidate = kurento.register.complexTypes.IceCandidate(message.candidate);
    user.addIceCandidate(message, candidate);
  } else {
    console.error("ice candidate with no user receive : " + socket.id);
  }
}
