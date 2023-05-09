import {v4 as uuidv4} from "uuid";
export const generatedUUID = () => {
  const uuid: string = uuidv4();
  return uuid.replace(/-/gi, "");
};
