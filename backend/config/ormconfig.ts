import ormconfig from "./ormconfig.json";

const isLocal = process.env.NODE_ENV === "local";

export default isLocal ? ormconfig : ormconfig;
