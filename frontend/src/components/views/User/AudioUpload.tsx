import React, {ChangeEvent, useState, useEffect} from "react";
import {postAudioFile, getAudioFile} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {fetchAudioList} from "@views/User/UserPage";

export let handleFileUpload: any = () => {};

const AudioUploadPage: React.FC = () => {
  const [selectedAudio, setSelectedAudio]: any = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [comment, setComment] = useState<string>("");

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

  handleFileUpload = async () => {
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

  return (
    <div>
      <h2>Upload your audio file</h2>
      <input type="file" accept="audio/*" onChange={handleAudioChange} />
      <h2>Upload your image file (optional)</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <input type="text" value={comment} onChange={handleCommentChange} placeholder="Enter comment" />
    </div>
  );
};

export default AudioUploadPage;
