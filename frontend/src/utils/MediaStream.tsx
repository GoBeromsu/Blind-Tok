export const getMedia = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return stream;
  } catch (err: any) {
    console.log(err);
  }
};
// mediaStream.tsx
// mediaStream.tsx
export const getAudio = async (audioDeviceId: string) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: audioDeviceId ? {exact: audioDeviceId} : undefined,
      },
    });
    return stream;
  } catch (err: any) {
    console.error(err); // 에러를 적절히 처리하도록 수정
    throw err; // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록 함
  }
};

export const getVideo = async (videoDeviceId: string) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoDeviceId ? {exact: videoDeviceId} : undefined,
      },
    });
    return stream;
  } catch (err: any) {
    console.error(err); // 에러를 적절히 처리하도록 수정
    throw err; // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록 함
  }
};

export const mergeStreams = (audioStream: MediaStream, videoStream: MediaStream) => {
  const result = new MediaStream();

  if (audioStream) {
    audioStream.getAudioTracks().forEach(track => {
      result.addTrack(track);
    });
  }

  if (videoStream) {
    videoStream.getVideoTracks().forEach(track => {
      result.addTrack(track);
    });
  }

  return result;
};
