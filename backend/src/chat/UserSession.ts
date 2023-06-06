import {ChatRoomData} from "./Consonants";

export default class {
  userid: string;
  socket: any;
  outgoingMedia: any;
  incomingMedia: any;
  iceCandidateQueue: any;
  roomlist: ChatRoomData[];
  // private roomName: string;
  constructor(userid: string, socket: any) {
    this.userid = userid;
    this.socket = socket;
    this.outgoingMedia = null;
    this.incomingMedia = {};
    this.iceCandidateQueue = {};
    this.roomlist = [];
    // this.roomName = "";
  }

  addIceCandidate(data: any, candidate: any) {
    if (data?.sender === this.userid) {
      if (this.outgoingMedia) {
        this.outgoingMedia.addIceCandidate(candidate);
      } else {
        console.error(data?.sender + "outgoingMedia is null");
        this.iceCandidateQueue[data?.sender].push({data: data, candidate: candidate});
      }
    } else {
      let webrtc = this.incomingMedia[data?.sender];
      if (webrtc) {
        webrtc.addIceCandidate(candidate);
      } else {
        console.error(data?.sender + "incomingMedia is null");
        if (!this.iceCandidateQueue[data?.sender]) {
          this.iceCandidateQueue[data?.sender] = [];
        }
        this.iceCandidateQueue[data?.sender].push({data: data, candidate: candidate});
      }
    }
  }
}
