import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import axios from "axios";

const GoogleLoginBtn = () => {
  const clientId = "644571698921-7564ulcresh2sif3ce5qafmc1p5vluns.apps.googleusercontent.com";
  const onSuccess = async res => {
    const idToken = res.credential;
    console.log(res, res.credential);

    //   try {
    //     const serverResponse = await axios.post("http://localhost:4000", {
    //       token: idToken,
    //     });

    //     console.log("Server response:", serverResponse.data);
    //   } catch (error) {
    //     console.error("Error while sending token to server:", error);
    //   }
  };

  const onFailure = error => {
    console.log("Google login failed:", error);
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin onSuccess={onSuccess} onFailure={onFailure} />
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleLoginBtn;
