import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
export function genKeypair() { const kp = nacl.box.keyPair();
  return { publicKey: naclUtil.encodeBase64(kp.publicKey), secretKey: naclUtil.encodeBase64(kp.secretKey) }; }
export function deriveSharedKey(peerPubB64: string, mySecretB64: string) {
  const peer = naclUtil.decodeBase64(peerPubB64); const my = naclUtil.decodeBase64(mySecretB64);
  return nacl.box.before(peer, my);
}
export function encryptMessage(sharedKey: Uint8Array, msg: string) {
  const nonce = nacl.randomBytes(24); const box = nacl.secretbox(naclUtil.decodeUTF8(msg), nonce, sharedKey);
  return { ciphertext: naclUtil.encodeBase64(box), nonce: naclUtil.encodeBase64(nonce) };
}
export function decryptMessage(sharedKey: Uint8Array, ciphertextB64: string, nonceB64: string) {
  const msg = nacl.secretbox.open(naclUtil.decodeBase64(ciphertextB64), naclUtil.decodeBase64(nonceB64), sharedKey);
  return msg ? naclUtil.encodeUTF8(msg) : null;
}