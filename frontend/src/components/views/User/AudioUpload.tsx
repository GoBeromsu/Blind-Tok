import React, {ChangeEvent, useState, useEffect} from "react";
import {postAudioFile, getFileMetaList} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {fetchAudioList} from "@views/User/UserPage";

export let handleFileUpload: any = () => {};

const AudioUploadPage: React.FC = () => {
  const [selectedAudio, setSelectedAudio]: any = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [comment, setComment] = useState<string>("");

  const handleAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedAudio(file);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    encodeFileToBase64(file)
      .then(base64File => {
        setSelectedImage(base64File as string);
      })
      .catch(error => {
        console.error("Failed to convert file:", error);
      });
    console.log(selectedImage);
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
const encodeFileToBase64 = (image: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (event: any) => resolve(event.target.result);
    reader.onerror = error => reject(error);
  });
};
