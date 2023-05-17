import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";
import {getStorage, setStorage} from "utils/SecureStorage";

export const localStorageEffect =
  (key: string) =>
  ({setSelf, onSet}: any) => {
    const savedValue = getStorage(key);
    // console.log("saveValue : ", savedValue);
    if (isEmpty(savedValue)) {
      setSelf(null);
    } else {
      setSelf(savedValue ? JSON.parse(savedValue) : null);
      // setSelf()
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
      if (isEmpty(newValue)) {
        // console.log("new Value : ", newValue);
        setStorage(key, JSON.stringify(newValue));
        // console.log("newvalue, isReset : ", newValue, isReset);
      }
    });
  };
// "" null undegined

export function isEmpty(value: any) {
  return value === "" || value === undefined || value === null;
}
export const userGoogleAuthState = atom<any>({
  key: "userGoogleAuthState",
  default: null,
  effects_UNSTABLE: [localStorageEffect("userGoogleAuthState")],
});
