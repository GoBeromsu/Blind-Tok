import {FastifyReply, FastifyServerOptions} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";

import {xssFilter} from "@utils/StringUtils";
import {ERROR_AUTH_EXPIRED, ERROR_AUTH_MALFORMED, ERROR_AUTH_NOTEXISTS, ERROR_AUTH_UNVALID} from "@error/AuthCode";
import {decrypted} from "@utils/CipherUtils";
import {verifyJWT} from "@utils/OAuth2Utils";
import {EXCEPT_URL} from "@config/adam.config";
const isProd = process.env.NODE_ENV == "production";
// console.log("isProd >", isProd);

export default function (fastify: FastifyInstance) {
  //1. preValidation : xxsFilter
  fastify.addHook("preValidation", async (req: FastifyRequest, _: FastifyReply) => {
    const body: any = req.body;
    const result: any = {};
    for (const key in body) {
      result[key] = xssFilter(body[key]);
    }
    req.body = result;
  });

  //2. preValidation : token_validation
  type jwt = {
    userid: number;
    email: string;
    iat: number;
    exp: number;
  };
  fastify.addHook("preValidation", async (req: FastifyRequest<{Body: {jwt: jwt}}>, reply: FastifyReply) => {
    const result = req.unsignCookie(req.cookies["access_token"] || "");
    if (result?.value == null) {
      return true;
    } else if (result.valid) {
      const _token = result.value || "";
      if (_token) {
        const decryptStr = decrypted(_token);
        try {
          const jwt: jwt = await verifyJWT(decryptStr);
          req.body = {...req.body, jwt};
          return true;
        } catch (err: any) {
          console.error(err);
          const isExcept = EXCEPT_URL.filter(url => req.url?.startsWith(url))?.length > 0;
          // if (req?.url == "/auth/user") reply.cookie("access_token", "", {path: "/", signed: true, expires: new Date()});
          if (!isExcept) {
            // reply.cookie("access_token", "", {path: "/", signed: true, expires: new Date()});
            if (err.message == "jwt expired") {
              //FIXME: 실제 에러 말고,,,, errorCode로 만들어서 던진다....[해결방안 찾을 것]
              //만료 시, 재발급 처리??
              // reply.code(ERROR_AUTH_EXPIRED).send(err);
            } else if (err.message == "jwt malformed" || err.message == "invalid signature") {
              reply.code(ERROR_AUTH_MALFORMED).send("ERROR_AUTH_MALFORMED");
            }
          }
        }
      } else {
        // 로그인으로 가야함.
        reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS");
      }
    } else {
      // 로그인으로 가야함.
      reply.code(ERROR_AUTH_UNVALID).send("ERROR_AUTH_UNVALID");
    }
  });

  fastify.server.keepAliveTimeout = 60000 * 2;
  //킹 갓 제네럿 멘토님
  fastify.addHook("onRequest", (request, reply, done) => {
    reply.header("Connection", "Keep-Alive");
    reply.header("Keep-Alive", `timeout=${fastify.server.keepAliveTimeout / 1000}`);
    done();
  });

  fastify.addHook("onSend", async (req: FastifyRequest, reply: FastifyReply, _) => {
    const ip =
      req.headers[
        'x-forwarded-fo  fastify.addHook("onRequest", (request, reply, done) => {\n' +
          '    reply.header("Connection", "Keep-Alive");\n' +
          '    reply.header("Keep-Alive", `timeout=${fastify.server.keepAliveTimeout / 1000}`);\n' +
          "    done();\n" +
          "  });\nr"
      ];
    const userAgent = req.headers["user-agent"];
    const url = req.url;
    const isNotStatic = false;
    const isNotHealthCheck = userAgent != "ELB-HealthChecker/2.0";
  });
}
