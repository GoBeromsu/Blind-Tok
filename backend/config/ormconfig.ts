import localConfig from "./ormconfig.local.json";
import devConfig from "./ormconfig.dev.json";
const isLocal = process.env.NODE_ENV === "local";
const isdev = process.env.NODE_ENV === "dev";
export default isLocal ? localConfig : devConfig;
