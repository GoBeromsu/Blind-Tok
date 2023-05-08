import jwt from "jsonwebtoken";
import {adam} from "@config/adam.config";
import {LOGIN_STATUS} from "@user/UserConstants";
import {getUserLogin} from "@user/service/UserLoginService";

const {token} = adam;

export function parseJWT(token: string) {
  try {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return JSON.parse("{}");
  }
}
export const checkSSO = async (type: string, ssoid: string, params: {email?: string; nickname?: string}) => {
  const oauth = await getUserLogin(ssoid);
  if (oauth) {
    const user = oauth.user;
    //FIXME: 로그인 하는데 파라미터를 더 받기 위해 가져옵니다 - 범수
    return {status: LOGIN_STATUS.LOGIN, auth: {type, ssoid, ...params}, user}; // 있으면 유저를 가저 온다.
  } else {
    return {status: LOGIN_STATUS.REGISTER, auth: {type, ssoid, ...params}};
  }
};
// JWT를 생성하고 서명하는 함수를 정의합니다.
// 'payload'는 토큰에 포함할 데이터이고, 'expiresIn'은 토큰의 만료 시간입니다.
export const signJWT = async (payload: any, expiresIn = token.expiresIn) => {
  // 'jwt.sign()'을 사용하여 토큰을 생성하고 서명합니다.
  // 'token.secret'은 토큰 서명에 사용되는 비밀 키입니다.
  return jwt.sign(payload, token.secret, {expiresIn: expiresIn});
};

// JWT를 검증하는 함수를 정의합니다.
// '_token'은 검증할 JWT 문자열입니다.
export const verifyJWT = async (_token: string): Promise<any> => {
  // 'jwt.verify()'를 사용하여 토큰을 검증하고 복호화된 토큰 데이터를 반환합니다.
  // 'token.secret'은 토큰 서명에 사용된 비밀 키입니다.
  return jwt.verify(_token, token.secret);
};
