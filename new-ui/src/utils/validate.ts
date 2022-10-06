import { parsePrivateKey, parseKey } from "sshpk";
// @ts-ignore
import webcrypto from "webcrypto";

export const validateKey = (typeKey: string, value: string) => {
  try {
    let x;
    if (typeKey === "private") {
      x = parsePrivateKey(value, "ssh");
    } else {
      x = parseKey(value, "ssh");
    }
    return true;
  } catch (err) {
    return false;
  }
};

const formatFingerprint = (fingerprint: string) => {
  const formatted = [];
  for (let i = 0; i < fingerprint.length; i += 2) {
    formatted.push(fingerprint.substr(i, 2));
  }
  return formatted.join(":");
};

export const convertToFingerprint = (privateKey: string, algo: string) => {
  try {
    const fingerprint = webcrypto
      .createHash(algo)
      .update(privateKey)
      .digest("hex");
    const formatedFingerprint = formatFingerprint(fingerprint);
    return formatedFingerprint;
  } catch (err) {
    return false;
  }
};

export const createSignatureOfPrivateKey = async (
  privateKeyData: any,
  username: string
) => {
  // @ts-ignore
  let signature = await window.global.testRsa(privateKeyData, username);
  return signature;
};

export const createKeyFingerprint = async (privateKeyData: any) => {
  // @ts-ignore
  let fingerprint = await window.global.createKeyFingerprint(privateKeyData);
  return fingerprint;
}
