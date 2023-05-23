import React, { ChangeEvent, useState, useEffect } from "react";
import { postAudioFile, getAudioFile, deleteAudioFile } from "@data/upload/axios";
import { useRecoilState } from "recoil";
import { userState } from "@data/user/state";

const AudioUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loginUser, setLoginUser]:any = useRecoilState(userState);
  const [audioList, setAudioList] = useState<any[]>([]);

  useEffect(() => {
    if (loginUser) {
      fetchAudioList();
    }
  }, [loginUser]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        await postAudioFile(selectedFile, loginUser);
        fetchAudioList();
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  // 해당 오디오파일을 리스트에서 삭제했을때 처리하는 메소드
  // const handleDeleteAudio = async (audioFile: any) => {
  //   try {
  //     if(loginUser){
  //     await deleteAudioFile(audioFile, loginUser);
  //     fetchAudioList();
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete audio file:", error);
  //   }
  // };

  const fetchAudioList = async () => {
    if (loginUser) {
      try {
        const audioFiles = await getAudioFile(loginUser.userid);
        setAudioList(audioFiles.data);
      } catch (error) {
        console.error("Failed to fetch audio files:", error);
      }
    }
  };

  return (
    <>
      <div>
        <h2>Upload your audio file</h2>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload</button>
        <h2>My audio list</h2>
        {audioList.length > 0 ? (
          <ul>
            {audioList.map((audioFile, index) => (
              <li key={index}>
                {audioFile.filename}
                <button /*onClick={() => handleDeleteAudio(audioFile)}*/>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No audio files found.</p>
        )}
      </div>
    </>
  );
};

export default AudioUploadPage;
