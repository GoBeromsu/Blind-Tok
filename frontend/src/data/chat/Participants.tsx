import {sendMessage} from "./Socket";
export class Participant {
  id: string;
  rtcPeer: any; // Need to replace `any` with actual type of rtcPeer
  iceCandidateQueue: any[] = []; // Need to replace `any` with actual type of elements in iceCandidateQueue

  constructor(id: string) {
    this.id = id;
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
      sender: this.id,
      sdpOffer: offerSdp,
    };
    console.log("Invoking SDP offer callback function " + msg.sender);
    sendMessage(msg, "video");
  }

  onIceCandidate(candidate: any): void {
    // Need to replace `any` with actual type of candidate
    //console.log(this.id + " Local candidate" + JSON.stringify(candidate));

    const message = {
      id: "onIceCandidate",
      candidate: {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      },
      sender: this.id,
    };
    sendMessage(message, "video");
  }

  dispose(): void {
    console.log("Disposing participant " + this.id);
    if (this.rtcPeer) {
      this.rtcPeer.dispose();
      this.rtcPeer = null;
    }
  }
}
