import React, {useEffect, useState, useRef} from "react";
import {getAudio, getMedia, getVideo} from "../../../utils/MediaStream";

const VideoChat: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getMediaSources = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(mediaDevices);
    };
    getMediaSources();
  }, []);

  const handleMuteClick = () => {
    console.log("Mute button clicked");
    // Implement mute/unmute logic here
  };

  const handleAudioSourceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Audio source changed", event.target.value);
    const stream = await getAudio(event.target.value);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  };

  const handleVideoSourceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Video source changed", event.target.value);
    const stream = await getVideo(event.target.value);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  };

  return (
    <div>
      <h1>Video Chat Page</h1>
      <video ref={videoRef} autoPlay muted={false}></video>
      <button onClick={handleMuteClick}>Mute/Unmute</button>
      <div>
        <label htmlFor="audioSource">Audio Source: </label>
        <select id="audioSource" onChange={handleAudioSourceChange}>
          {devices
            .filter(device => device.kind === "audioinput")
            .map(device => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label || device.deviceId}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label htmlFor="videoSource">Video Source: </label>
        <select id="videoSource" onChange={handleVideoSourceChange}>
          {devices
            .filter(device => device.kind === "videoinput")
            .map(device => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label || device.deviceId}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default VideoChat;
