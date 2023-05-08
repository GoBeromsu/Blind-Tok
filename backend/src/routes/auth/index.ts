import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {editUserRefresh, getUserInfo} from "@user/service/UserService";
import {getUserLogin} from "@user/service/UserLoginService";
import {ERROR_AUTH_NOTEXISTS} from "../../error/AuthCode";
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
  fastify.post("/token", async (req: FastifyRequest<{Body: {ssoid: string; userid: number}}>, reply: FastifyReply) => {
    // 사용자가 SSO Login을 하고 입력을 하고, 토큰을 요청할 때 호출한다
    const {ssoid, userid} = req.body;
    const user = await getUserLogin(ssoid, userid); //db에 저장된 유저의 정보를 가지고 온다.

    if (!user) {
      return reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS"); //유저가 있어서 token을 요청했는데 없으니가 에러를 일으킨다.
    }
    // 액세스 토큰을 만든다. refresh token은 일단, 액세스 토큰과 동일하다
    const {userid: userId, email} = user;
    const access = await signJWT({userid: userId, ssoid, email});
    const accessToken = encrypted(access);
    // refresh 토큰을 재발급 받는 과정이다
    let refreshToken = user?.user?.refresh_token || "";
    if (refreshToken) {
      // refresh 토큰이 있다면 복호화하고 검증한다
      // console.log("Refresh Token : ", refreshToken);
      try {
        const decryptStr = decrypted(refreshToken);
        await verifyJWT(decryptStr);
      } catch (err) {
        // 유효하지 않은 토큰이 있다면 다시 업데이트 한다
        // console.log("Token is expired");
        const refresh = await signJWT({userid: userId, ssoid, email}, "30d");
        refreshToken = encrypted(refresh);
        await editUserRefresh(userId, {refresh_token: refreshToken});
      }
    } else {
      const refresh = await signJWT({userid: userId, ssoid, email}, "30d");
      refreshToken = encrypted(refresh);
      await editUserRefresh(userId, {refresh_token: refreshToken});
    }
    reply.cookie("refresh_token", refreshToken, {path: "/", signed: true});
    //FIXME: access_token을 30분 짜리로 만들어서 줘?!
    reply.cookie("access_token", accessToken, {path: "/", signed: true});
    //발급한 토큰을 저장한다
    addLoginHistory({userid: userId, ssoid, token: accessToken});
    reply.send(accessToken);
  });
}
