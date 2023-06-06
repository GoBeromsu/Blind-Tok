import React, {useEffect, useState, useRef} from "react";
import {getAudio, getVideo, mergeStreams} from "../../../utils/MediaStream";
import {Box, Button} from "@mui/material";
import {useParams} from "react-router-dom";
import {useSocket} from "@data/chat/useSocket";
import {sendMessage} from "@data/chat";
import {getRooms} from "@data/chat/chat_list";
import {useRecoilValue} from "recoil";
import {userState} from "@data/user/state";

const VideoChat: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoSource, setVideoSource] = useState<string>("");
  const [audioSource, setAudioSource] = useState<string>("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mute, setMute] = useState<boolean>(false);

  const loginUser: any = useRecoilValue(userState);
  const {roomid}: any = useParams();
  const socket = useSocket();

  useEffect(() => {
    const getMediaSources = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(mediaDevices);
      const defaultAudioDevice = mediaDevices.find(device => device.kind === "audioinput");
      const defaultVideoDevice = mediaDevices.find(device => device.kind === "videoinput");
      if (defaultAudioDevice) setAudioSource(defaultAudioDevice.deviceId);
      if (defaultVideoDevice) setVideoSource(defaultVideoDevice.deviceId);
    };
    getMediaSources();
  }, []);
  useEffect(() => {
    sendMessage(loginUser?.userid, "dataInit"); // 유저 화면 재로딩 되면, Socket 업데이트 해줘야해서 추가해둠
  }, []);
  useEffect(() => {
    const initializeMediaStream = async () => {
      const audioStream = await getAudio(audioSource);
      const videoStream = await getVideo(videoSource);
      const mergedStream = mergeStreams(audioStream, videoStream);
      if (videoRef.current && mergedStream) {
        videoRef.current.srcObject = mergedStream;
        videoRef.current.muted = mute;
        setMediaStream(mergedStream);
      }
    };

    initializeMediaStream();
  }, [audioSource, videoSource]);
  useEffect(() => {
    if (socket) {
      socket.on("message", (message: any) => {
        let {id, data} = message;
        switch (id) {
          default:
            break;
        }
      });
    }
    return () => {
      socket.off();
    };
  }, [socket]);

  const handleMuteClick = () => {
    setMute(prevMute => !prevMute);
    if (videoRef.current) {
      videoRef.current.muted = !mute;
    }
  };

  const handleAudioSourceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Audio source changed", event.target.value);
    setAudioSource(event.target.value);
  };

  const handleVideoSourceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Video source changed", event.target.value);
    setVideoSource(event.target.value);
  };

  return (
    <Box>
      <Box>Video Chat Page</Box>
      <video ref={videoRef} autoPlay></video>

      <Box>
        <label htmlFor="audioSource">Audio Source: </label>
        <select id="audioSource" value={audioSource || ""} onChange={handleAudioSourceChange}>
          <option value="">Default</option>
          {devices
            .filter(device => device.kind === "audioinput")
            .map(device => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label || device.deviceId}
              </option>
            ))}
        </select>
      </Box>
      <Box>
        <label htmlFor="videoSource">Video Source: </label>
        <select id="videoSource" value={videoSource || ""} onChange={handleVideoSourceChange}>
          <option value="">Default</option>
          {devices
            .filter(device => device.kind === "videoinput")
            .map(device => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label || device.deviceId}
              </option>
            ))}
        </select>
      </Box>
      <Box>
        <Button onClick={handleMuteClick}>{mute ? "Unmute" : "Mute"}</Button>
        <Button>Join Room : 기능 없음</Button>
        <Button onClick={() => createVideoForParticipant("test")}>Create Video</Button>
      </Box>
      <Box id="videolist"></Box>
    </Box>
  );
};

const createVideoForParticipant = (participant: any) => {
  const video = document.createElement("video");
  video.id = participant.sid;

  video.autoplay = true;
  video.muted = true;
  video.className = "video";
  video.poster = "https://koreanbots.dev/api/image/discord/avatars/739392161929363507.webp?size=256";
  document.getElementById("videolist")?.appendChild(video);
};
export default VideoChat;
