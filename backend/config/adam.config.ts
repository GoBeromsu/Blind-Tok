import adam from "./adam.json";

const isProd = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";
const SERVER_URI = isProd ? adam.server.prod : isLocal ? adam.server.local : adam.server.dev;
const EXCEPT_URL = ["/login", "/auth/refreshToken", "/auth/token", "/auth/google/callback", "/auth/logout", "/public", "/assets", "/favicon.ico"];

export {SERVER_URI, adam, EXCEPT_URL};
