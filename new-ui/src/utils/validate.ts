// import { parsePrivateKey, parseKey } from "../sshpk";
import sshpk from "sshpk";

const { parsePrivateKey, parseKey } = sshpk;

export const validateKey = (typeKey: string, value: string) => {
  try {
    let x;
    if (typeKey === "private") {
      x = parsePrivateKey(value);
      console.log(x);
    } else {
      x = parseKey(value);
      console.log(x);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const convertToFingerprint = (privateKey : string) => {
  return parsePrivateKey(privateKey).fingerprint('md5');
};
