import {Socket} from "socket.io";

interface Media {
  addIceCandidate: (candidate: any) => void;
}

interface CandidateData {
  sender: string;
  [key: string]: any;
}

interface QueueItem {
  data: CandidateData;
  candidate: any;
}

class UserSession {
  id: string;
  socket: Socket;
  outgoingMedia: Media | null;
  incomingMedia: {[id: string]: Media};
  iceCandidateQueue: {[id: string]: QueueItem[]};
  roomName?: string;
  name: string;

  constructor(id: string, socket: Socket) {
    this.id = id;
    this.socket = socket;
    this.outgoingMedia = null;
    this.incomingMedia = {};
    this.iceCandidateQueue = {};
  }

  addIceCandidate(data: CandidateData, candidate: any) {
    if (data.sender === this.id) {
      if (this.outgoingMedia) {
        console.log(" add candidate to self : " + data.sender);
        this.outgoingMedia.addIceCandidate(candidate);
      } else {
        console.error(" still does not have outgoing endpoint for : " + data.sender);
        if (!this.iceCandidateQueue[data.sender]) {
          this.iceCandidateQueue[data.sender] = [];
        }
        this.iceCandidateQueue[data.sender].push({
          data: data,
          candidate: candidate,
        });
      }
    } else {
      var webRtc = this.incomingMedia[data.sender];
      if (webRtc) {
        console.log(this.id + " add candidate to from : " + data.sender);
        webRtc.addIceCandidate(candidate);
      } else {
        console.error(this.id + " still does not have endpoint for : " + data.sender);
        if (!this.iceCandidateQueue[data.sender]) {
          this.iceCandidateQueue[data.sender] = [];
        }
        this.iceCandidateQueue[data.sender].push({
          data: data,
          candidate: candidate,
        });
      }
    }
  }

  sendMessage(data: any) {
    this.socket.emit("message", data);
  }

  setRoomName(roomName: string) {
    this.roomName = roomName;
  }
}

export default UserSession;
