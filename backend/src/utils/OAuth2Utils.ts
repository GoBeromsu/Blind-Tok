import jwt from "jsonwebtoken";
import {adam} from "@config/adam.config";
const {token} = adam;

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
