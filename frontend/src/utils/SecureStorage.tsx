import CryptoJS from "crypto-js"; // Import the CryptoJS library for encryption/decryption
import {LocalStorage} from "typescript-web-storage"; // Import the third-party typescript-web-storage library for working with local storage in TypeScript
const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET_KEY;

// Function to generate a hash value for a given input string using SHA256

export function getHash(value: string) {
  const key = CryptoJS.SHA256(value, {SECRET_KEY});
  return key;
}

export function setStorage(key: string, value: string) {
  const storage = new LocalStorage();
  const data = CryptoJS.AES.encrypt(value, SECRET_KEY);
  storage.setItem<string>(key, data.toString());
}

export function getStorage(key: string) {
  const storage = new LocalStorage();
  const data = CryptoJS.AES.decrypt(storage.getItem<string>(key) ?? "", SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return data;
}
