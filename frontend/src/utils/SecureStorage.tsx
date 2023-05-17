import CryptoJS from "crypto-js";
import {LocalStorage} from "typescript-web-storage";

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET_KEY;

if (typeof SECRET_KEY === "undefined") {
  throw new Error("SECRET_KEY is not defined");
}

const strSecretKey = String(SECRET_KEY);

export function getHash(value: string) {
  const key = CryptoJS.SHA256(value);
  return key;
}

export function setStorage(key: string, value: string) {
  const storage = new LocalStorage();
  const data = CryptoJS.AES.encrypt(value, strSecretKey);
  storage.setItem<string>(key, data.toString());
}

export function getStorage(key: string) {
  const storage = new LocalStorage();
  const encryptedData = storage.getItem<string>(key);
  if (encryptedData == null) {
    return null;
  }
  const data = CryptoJS.AES.decrypt(encryptedData, strSecretKey);
  return data.toString(CryptoJS.enc.Utf8);
}
