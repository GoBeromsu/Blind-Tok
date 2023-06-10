import React, { ChangeEvent, useState, useEffect } from "react";
import { postAudioFile, getFileMetaList, deleteAudioFile } from "@data/upload/axios";
import { useRecoilState } from "recoil";
import { userState, sideState } from "@data/user/state";
import "@style/AudioUpload.css"

const AudioUploadPage: React.FC = () => {
  const [selectedAudio, setSelectedAudio]: any = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [audioList, setAudioList] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [sidebarOpen, setSidebarOpen]: any = useRecoilState(sideState);
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
    if (!file) return;

    encodeFileToBase64(file)
      .then((base64File) => {
        setSelectedImage(base64File as string);
      })
      .catch((error) => {
        console.error("Failed to convert file:", error);
      });
    console.log(selectedImage);
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
      console.log("image, comment : ", selectedImage, comment);
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
        const audioFiles = await getFileMetaList(loginUser.userid);
        setAudioList(audioFiles.data);
      } catch (error) {
        console.error("Failed to fetch audio files:", error);
      }
    }
  };

  return (
    <>
      <div style={sidebarOpen ? { paddingLeft: "350px" } : { paddingLeft: "90px" }}>
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
                  {audioFile.image && <img src={audioFile.image} alt="Audio Image" className="audio-image" />}
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

const encodeFileToBase64 = (image: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (event: any) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
  });
};
