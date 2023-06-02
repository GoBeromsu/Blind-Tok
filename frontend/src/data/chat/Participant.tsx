import {sendMessage} from "./index";

export default class {
  userid: string;
  rtcPeer: any; // Need to replace `any` with actual type of rtcPeer
  iceCandidateQueue: any[] = []; // Need to replace `any` with actual type of elements in iceCandidateQueue

  constructor(id: string) {
    this.userid = id;
    this.rtcPeer = null;
  }

  offerToReceiveVideo(error: Error, offerSdp: any): void {
    // Need to replace `any` with actual type of offerSdp
    if (error) {
      console.error("sdp offer error");
      return;
    }
    const msg = {
      id: "receiveVideoFrom",
      sender: this.userid,
      sdpOffer: offerSdp,
    };
    console.log("Invoking SDP offer callback function " + msg.sender);
    sendMessage(msg, "video");
  }

  onIceCandidate(candidate: any): void {
    // Need to replace `any` with actual type of candidate
    //console.log(this.userid + " Local candidate" + JSON.stringify(candidate));

    const message = {
      id: "onIceCandidate",
      candidate: {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      },
      sender: this.userid,
    };
    sendMessage(message, "video");
  }

  dispose(): void {
    console.log("Disposing participant " + this.userid);
    if (this.rtcPeer) {
      this.rtcPeer.dispose();
      this.rtcPeer = null;
    }
  }
}
