import {Socket} from "socket.io";

export default class {
  id: string;
  name: string;
  socket: Socket;
  outgoingMedia: any;
  incomingMedia: any;
  iceCandidateQueue: any;
  roomName: any;
  constructor(id: string, name: string, socket: Socket) {
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.outgoingMedia = null;
    this.incomingMedia = {};
    this.iceCandidateQueue = {};
    this.roomName = null;
  }

  addIceCandidate(data: any, candidate: any) {
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

  setRoomName(roomName: any) {
    this.roomName = roomName;
  }
}
