import {useRecoilState, useSetRecoilState} from "recoil";
import {userState} from "@data/user/state";
import {useNavigate} from "react-router-dom";
import {useGoogleLogin} from "@react-oauth/google";
import React from "react";
import GoogleButton from "react-google-button";
import {getGoogleInfoAxios, getToken, postUser} from "@data/login/axios";
import {userGoogleAuthState} from "@data/login/state";
import {Box, Typography, Container, Card, CardContent, CardMedia, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const logoImg = "/image/Logo.png";
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: theme.spacing(3),
  },
  card: {
    height: 400,
    width: 450,
  },
  content: {
    backgroundColor: "#f7f7f7",
    textAlign: "center",
  },
  title: {
    fontFamily: "Montserrat, sans-serif",
    color: theme.palette.text.primary,
  },
  media: {
    height: 250,
    background: `url(${logoImg}) no-repeat center center`,
    backgroundColor: "#ffffff",
    backgroundSize: 300,
  },
}));

const Login: React.FC = () => {
  const [googleAuth, setGoogleAuth] = useRecoilState(userGoogleAuthState);
  const setUser = useSetRecoilState(userState);

  const classes = useStyles();
  const navigate = useNavigate();

  const handleLoginSuccess = async (code: string) => {
    const {
      data,
      data: {status, auth, user},
    } = await getGoogleInfoAxios(code);

    if (status == "REGISTER") {
      setGoogleAuth(data); //구글 sso 로그인 등록을 하기 위한, 정보를 state에 저장함
      const {ssoid, nickname, email, type} = auth;
      const result = await postUser({ssoid: ssoid, email: email, name: nickname, type: type});
      if (result.status == 200) {
        navigate("/login");
      }
    } else {
      const {ssoid} = auth;
      const {userid} = user;
      const result = await getToken({userid, ssoid}); //로그인 하고, 토큰을 가져온다

      setUser(user); // loginUser, #user 통채로 저장하지 않고, access_token으로 가져오도록 수정
      setGoogleAuth(null); //혹시나 유저 정보가 들어있을지 모르니까 비운다
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
    <Container component="main">
      <Box className={classes.root}>
        <Card className={classes.card}>
          <div className={classes.media} />
          <CardContent className={classes.content}>
            <Typography component="h1" variant="h5" className={classes.title}>
              SIGN - IN
            </Typography>
            <br />
            <Button variant="contained" color="primary" onClick={googleSocialLogin}>
              Google 로그인
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
export default Login;
