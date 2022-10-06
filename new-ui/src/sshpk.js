const NodeRSA = require("node-rsa");
const sshpk = require('sshpk');

const createSignatureOfPrivateKey = (
  privateKeyData,
  username
) => {
  let signature;
  const key = NodeRSA(privateKeyData);
  key.setOptions({ signingScheme: "pkcs1-sha1" });
  signature = encodeURIComponent(key.sign(username, "base64"));
  return signature;
};

const createKeyFingerprint = (privateKeyData) => {
  const key = sshpk.parsePrivateKey(privateKeyData, "ssh");
  const fingerprint = key.fingerprint("md5");
  return fingerprint;
};

window.global.testRsa = createSignatureOfPrivateKey;
window.global.createKeyFingerprint = createKeyFingerprint;
