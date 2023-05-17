import {useRecoilState, useSetRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {useNavigate} from "react-router-dom";
import {useGoogleLogin} from "@react-oauth/google";
import {userGoogleAuthState} from "@data/Login/state";
import {getGoogleInfoAxios, getToken} from "@data/Login/axios";
import React from "react";
import GoogleButton from "react-google-button";

const Login = () => {
  const [googleAuth, setGoogleAuth] = useRecoilState(userGoogleAuthState);
  const setUser = useSetRecoilState(userState);

  const navigate = useNavigate();
  const handleLoginSuccess = async (code: string) => {
    const {
      data,
      data: {status, auth, user},
    } = await getGoogleInfoAxios(code);

    if (status == "REGISTER") {
      setGoogleAuth(data); //구글 sso 로그인 등록을 하기 위한, 정보를 state에 저장함

      navigate("/register");
    } else {
      const {ssoid} = auth;
      const {userid} = user;
      const result = await getToken({userid, ssoid}); //로그인 하고, 토큰을 가져온다

      setUser(user); // loginUser, #user 통채로 저장하지 않고, access_token으로 가져오도록 수정
      setGoogleAuth(null); //혹시나 유저 정보가 들어있을지 모르니까 비운다
      console.log(data);
      navigate("/");
    }
  };
  const handleLoginError = (errorResponse: any) => {
    console.error(errorResponse);
  };
  const googleSocialLogin = useGoogleLogin({
    scope: "email profile",
    onSuccess: async ({code}) => {
      handleLoginSuccess(code);
    },
    onError: errorResponse => {
      handleLoginError(errorResponse);
    },
    flow: "auth-code",
  });

  return (
    <div>
      <h1>로그인 페이지</h1>
      <GoogleButton onClick={googleSocialLogin} />
    </div>
  );
};
export default Login;
