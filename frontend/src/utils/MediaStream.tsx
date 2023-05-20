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
export const getAudio = async (audioDeviceId: string) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: audioDeviceId ? {exact: audioDeviceId} : undefined,
      },
    });
    return stream;
  } catch (err: any) {
    console.log(err);
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
    console.log(err);
  }
};
