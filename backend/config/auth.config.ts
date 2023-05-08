import oauth2 from "@fastify/oauth2";
import {adam, SERVER_URI} from "@config/adam.config";

const _google = adam.oauth.google;
let callbackUri = `${SERVER_URI}${_google.redirectUri}`;
const googleAuth = {
  name: "googleOAuth2",
  scope: ["email", "profile"],
  credentials: {
    client: {id: _google.clientId, secret: _google.clientSecret},
    auth: oauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: _google.redirectPath,
  callbackUri,
  callbackUriParams: {
    access_type: "offline",
  },
};
