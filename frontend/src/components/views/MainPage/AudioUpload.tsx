import React, {ChangeEvent, useState, useEffect} from "react";
import {postAudioFile, getAudioFile, deleteAudioFile} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";

const AudioUploadPage: React.FC = () => {
  const [selectedAudio, setSelectedAudio]: any = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [audioList, setAudioList] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    if (loginUser) {
      fetchAudioList();
    }
  }, [loginUser]);

  const handleAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedAudio(file);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedImage(file);
  };

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedAudio);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      formData.append("comment", comment);
      await postAudioFile(formData, loginUser.userid);
      fetchAudioList();
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleDeleteAudio = async (audioFile: any) => {
    try {
      if (loginUser) {
        await deleteAudioFile(audioFile, loginUser);
        fetchAudioList();
      }
    } catch (error) {
      console.error("Failed to delete audio file:", error);
    }
  };

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
        <input type="file" accept="audio/*" onChange={handleAudioChange} />
        <h2>Upload your image file (optional)</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input type="text" value={comment} onChange={handleCommentChange} placeholder="Enter comment" />
        <button onClick={handleFileUpload}>Upload</button>
        <h2>My audio list</h2>
        {audioList.length > 0 ? (
          <ul>
            {audioList.map((audioFile, index) => (
              <li key={index}>
                <div>
                  <h3>{audioFile.filename}</h3>
                  <p>Comment: {audioFile.comment}</p>
                  {audioFile.image && <img src={audioFile.image} alt="Audio Image" />}
                  <button onClick={() => handleDeleteAudio(audioFile)}>Delete</button>
                </div>
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
