import React, {ChangeEvent, useState, useEffect} from "react";
import {postAudioFile, getAudioFile} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";

const AudioUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [audioList, setAudioList] = useState<any[]>([]);

  useEffect(() => {
    // loginUser가 존재하는 경우에만 fetchAudioList를 호출
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
        const data = await postAudioFile(selectedFile, loginUser);
        
        // console.log(data);
        // 파일 업로드 후 오디오 파일 리스트 갱신
        fetchAudioList();
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  // 유저의 업로드 된 파일 조회
  const fetchAudioList = async () => {
    if (loginUser) { // loginUser가 존재하는지 확인
      try {
        const audioFiles = await getAudioFile(loginUser.userid);
        // console.log(loginUser.userid)
        // console.log("THis is my files "+JSON.stringify(audioFiles));
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
              <li key={index}>{audioFile.filename}</li>
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