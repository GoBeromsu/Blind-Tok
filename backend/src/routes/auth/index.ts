import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {editUserRefresh, getUserInfo, getUserInfoByRefreshToken} from "@user/service/UserService";

import {getUserLogin} from "@user/service/UserLoginService";
import {ERROR_AUTH_EXPIRED, ERROR_AUTH_NOTEXISTS, ERROR_AUTH_REFRESH_EXPIRED, ERROR_AUTH_TOKEN_NOTEXISTS, ERROR_AUTH_UNVALID} from "@error/AuthCode";
import {signJWT, verifyJWT} from "@utils/OAuth2Utils";
import {decrypted, encrypted} from "@utils/CipherUtils";
import {addLoginHistory} from "@user/service/LoginHistoryService";

export default async function (fastify: FastifyInstance) {
  type jwt = {userid: number; email: string; iat: number; exp: number};

  fastify.get("/user", async (req: FastifyRequest<{Body: {jwt: jwt}}>, reply: FastifyReply) => {
    const {jwt} = req.body;
    const userid = jwt?.userid;
    if (userid) {
      const user = await getUserInfo(userid);
      reply.send(user);
    } else {
      reply.send(null);
    }
  });
  // POST 요청을 처리하는 "/logout" 엔드포인트를 정의합니다.
  fastify.post("/logout", async (req: FastifyRequest, reply: FastifyReply) => {
    // access_token 쿠키를 비워서 만료시키고, 클라이언트에 전송합니다.
    reply.cookie("access_token", "", {path: "/", signed: true, expires: new Date()});

    // refresh_token 쿠키를 비워서 만료시키고, 클라이언트에 전송합니다.
    reply.cookie("refresh_token", "", {path: "/", signed: true, expires: new Date()});
  });

  fastify.post("/token", async (req: FastifyRequest<{Body: {ssoid: string; userid: number}}>, reply: FastifyReply) => {
    // 사용자가 SSO Login을 하고 입력을 하고, 토큰을 요청할 때 호출한다
    const {ssoid, userid} = req.body;
    //db에 저장된 유저의 정보를 가지고 온다.
    const user = await getUserLogin(ssoid, userid);
    if (!user) {
      return reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS"); //유저가 있어서 token을 요청했는데 없으니가 에러를 일으킨다.
    }
    // 액세스 토큰을 만든다. refresh token은 일단, 액세스 토큰과 동일하다
    // TODO: jwt 토큰 흐름 공부하기
    const {userid: userId, email} = user;
    const access = await signJWT({userid: userId, ssoid, email});
    const accessToken = encrypted(access);
    // refresh 토큰을 재발급 받는 과정이다
    let refreshToken = user?.user?.refresh_token || "";
    if (refreshToken) {
      try {
        const decryptStr = decrypted(refreshToken);
        await verifyJWT(decryptStr);
      } catch (err) {
        // 유효하지 않은 토큰이 있다면 다시 업데이트 한다
        const refresh = await signJWT({userid: userId, ssoid, email}, "30d");
        refreshToken = encrypted(refresh);
        await editUserRefresh(userId, {refresh_token: refreshToken});
      }
    } else {
      const refresh = await signJWT({userid: userId, ssoid, email}, "30d");
      refreshToken = encrypted(refresh);
      await editUserRefresh(userId, {refresh_token: refreshToken});
    }
  });
  // POST 요청을 처리하는 "/refreshToken" 엔드포인트를 정의합니다.
  fastify.post("/refreshToken", async (req: FastifyRequest, reply: FastifyReply) => {
    // 쿠키에서 "refresh_token"을 가져와서 서명을 확인합니다.
    const result = req.unsignCookie(req.cookies["refresh_token"] || "");

    // refresh_token이 없으면 오류를 반환합니다.
    if (!result || result.value == null) {
      return reply.code(ERROR_AUTH_TOKEN_NOTEXISTS).send("ERROR_AUTH_TOKEN_NOTEXISTS");
    }

    // 서명이 올바르지 않으면 오류를 반환합니다.
    if (!result.valid) {
      return reply.code(ERROR_AUTH_UNVALID).send("ERROR_AUTH_UNVALID");
    }

    const refresh_token = result.value || "";
    const user = await getUserInfoByRefreshToken(refresh_token);

    // 사용자가 존재하지 않으면 오류를 반환합니다.
    if (!user) {
      return reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS");
    }

    try {
      // refresh_token을 복호화하고 JWT를 검증합니다.
      const decryptStr = decrypted(refresh_token);
      const {userid, ssoid, email} = await verifyJWT(decryptStr);

      // 새로운 access 토큰을 생성합니다.
      const access = await signJWT({userid, ssoid, email});
      const access_token = encrypted(access);

      // access_token을 쿠키로 설정하고 클라이언트에 전송합니다.
      reply.cookie("access_token", access_token, {path: "/", signed: true});

      // 로그인 기록을 추가합니다.
      await addLoginHistory({userid, ssoid, token: access_token});

      return reply.send("USER_AUTHENTICATED");
    } catch (err) {
      // 토큰 검증에 실패하면 오류를 반환합니다.
      return reply.code(ERROR_AUTH_REFRESH_EXPIRED).send("ERROR_AUTH_REFRESH_EXPIRED");
    }
  });
}
