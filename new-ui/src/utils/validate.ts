import { parsePrivateKey, parseKey } from "sshpk";
// @ts-ignore
import webcrypto from "webcrypto";

export const validateKey = (typeKey: string, value: string) => {
  try {
    let x;
    if (typeKey === "private") {
      x = parsePrivateKey(value, "ssh");
      console.log(x);
    } else {
      x = parseKey(value, "ssh");
      console.log(x);
    }
    return true;
  } catch (err) {
    console.log(err);
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
    console.log(err);
    return false;
  }
};

const isObject = (value: any) => {
  let type = typeof value;
  return !!value && (type == "object" || type == "function");
};

const isString = (value: any) => {
  return typeof value == "string" || value instanceof String;
};

const isNumber = (value: any) => {
  return (
    typeof value == "number" || (!isNaN(parseFloat(value)) && isFinite(value))
  );
};

const getDataForEncrypt = function (buffer: any, encoding: any) {
  if (isString(buffer) || isNumber(buffer)) {
    return Buffer.from("" + buffer, encoding || "utf8");
  } else if (Buffer.isBuffer(buffer)) {
    return buffer;
  } else if (isObject(buffer)) {
    return Buffer.from(JSON.stringify(buffer));
  } else {
    throw Error("Unexpected data type");
  }
};

// const keyPairSign = async (privateKey: any, data: any) => {
//   console.log("webcrypto", webcrypto);

//   const key = await webcrypto.importKey(
//     "pkcs8",
//     privateKey,
//     {
//       name: "RSA-PSS",
//       hash: { name: "SHA-256" },
//     },
//     false,
//     ["sign"]
//   );
//   const signature = await webcrypto.sign(
//     {
//       name: "RSA-PSS",
//       saltLength: 32,
//     },
//     key,
//     data
//   );
//   return signature;
// };

export const passKeyToBase64 = async (key: any, username: string) => {
  try {
    console.log("webcrypto", await webcrypto.subtle);
    const sign = await webcrypto.subtle.sign("sha256");
    // @ts-ignore
    console.log("sign", sign);
    const keyBase64 = webcrypto.sign(key.signingScheme, username, key.keyPair);
    return keyBase64;
  } catch (err) {
    console.log(err);
    return false;
  }
};


export const keySignToBase64 = async (key: any, data: string) => {
  try {
    const dataToSign = getDataForEncrypt(data, "base64");
    console.log("dataToSign", dataToSign);
    const keyToArray = new Uint8Array(key);

    const cryptoKey = await window.crypto.subtle.importKey(
      "pkcs8",
      keyToArray,
      {
        name: "RSA-PSS",
        hash: { name: "SHA-256" },
      },
      false,
      ["sign"]
    );
    console.log("cryptoKey", cryptoKey);
    const keyBase64 = await window.crypto.subtle.sign(
      "pkcs1-sha1",
      cryptoKey,
      dataToSign
    );
    return keyBase64;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const createRSAKey = async (keySize: number) => {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: keySize,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" },
      },
      true,
      ["sign", "verify"]
    );
    const exportedKey = await window.crypto.subtle.exportKey(
      "jwk",
      key.privateKey
    );
    return exportedKey;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export const createSignatureOfPrivateKey = async (
  privateKey: any,
  data: string
) => {
  try {
    const rsaKey = await createRSAKey(privateKey.length);
    console.log("rsaKey", rsaKey);
    const dataToSign = getDataForEncrypt(data, "base64");
    const keyToArray = new Uint8Array(privateKey);
    const cryptoKey = await window.crypto.subtle.importKey(
      "pkcs8",
      keyToArray,
      {
        name: "RSA-PSS",
        hash: { name: "SHA-256" },
      },
      false,
      ["sign"]
    );
    const keyBase64 = await window.crypto.subtle.sign(
      "pkcs1-sha1",
      cryptoKey,
      dataToSign
    );
    return keyBase64;
  } catch (err) {
    console.log(err);
    return false;
  }
}

