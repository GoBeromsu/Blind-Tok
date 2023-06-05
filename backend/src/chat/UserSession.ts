export default class {
  userid: string;
  socket: any;
  private outGoingMedia: any;
  private incomingMedia: any;
  private iceCandidateQueue: any;
  roomlist: number[];
  // private roomName: string;
  constructor(userid: string, socket: any) {
    this.userid = userid;
    this.socket = socket;
    this.outGoingMedia = null;
    this.incomingMedia = {};
    this.iceCandidateQueue = {};
    this.roomlist = [];
    // this.roomName = "";
  }

  addIceCandidate(data: any, candidate: any) {
    if (data?.sender === this.userid) {
      if (this.outGoingMedia) {
        this.outGoingMedia.addIceCandidate(candidate);
      } else {
        console.error(data?.sender + "outGoingMedia is null");
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

  sendMessage(data: any) {
    this.socket.emit("send_message", data);
  }

  //TODO: 그냥 room name 대신 id를 주는게 더 유효할거 같기도?
  // setRoom(roomName: string) {
  //   this.roomName = roomName;
  // }
}
