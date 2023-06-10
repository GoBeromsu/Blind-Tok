import React, {ChangeEvent, useState} from "react";
import {postAudioFile} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {fetchAudioList} from "@views/User/UserPage";
import {Button, Container, TextField, Typography, Grid} from '@material-ui/core';
import Br from "@views/Layout/Br";

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
    <Container>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h2">Upload your audio file</Typography>
          <input
            accept="audio/*"
            id="contained-button-file-audio"
            multiple
            type="file"
            style={{ display: 'none' }}
            onChange={handleAudioChange}
          />
          <label htmlFor="contained-button-file-audio">
          <br/>
            <Button variant="contained" color="primary" component="span">
              Upload Audio
            </Button>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" component="h2">Upload with image (optional)</Typography>
          <input
            accept="image/*"
            id="contained-button-file-image"
            multiple
            type="file"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <label htmlFor="contained-button-file-image">
            <br/>
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h4" component="h2">Upload with file Comment (optional)</Typography>
        <br/>
          <TextField
            id="outlined-multiline-flexible"
            label="Comment"
            multiline
            rowsMax={4}
            value={comment}
            onChange={handleCommentChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
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
