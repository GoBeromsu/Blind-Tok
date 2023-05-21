// AudioUploadPage.tsx
import React, {ChangeEvent, useState} from "react";
import {postAudioFile, getAudioFile} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";

const AudioUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        console.log(selectedFile);
        const data = await postAudioFile(selectedFile, loginUser);
        console.log(data);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  return (
    <>
    <div>
      <h2>Upload your audio file</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
    <div style={{display:""}}>
    <h2>My audio list</h2>
    </div>


    </>
  );
};

export default AudioUploadPage;
