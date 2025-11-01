import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

/**
 * Generate a new NaCl public/secret keypair encoded as Base64 strings.
 *
 * @returns Object containing Base64 encoded public and secret keys.
 */
export function genKeypair(): { publicKey: string; secretKey: string } {
  const pair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(pair.publicKey),
    secretKey: naclUtil.encodeBase64(pair.secretKey),
  };
}

/**
 * Derive a shared key using the peer's public key and our secret key (both Base64 encoded).
 *
 * @param peerPubKeyB64 Base64 encoded peer public key.
 * @param mySecretKeyB64 Base64 encoded current user's secret key.
 * @returns Shared key as a Uint8Array (32 bytes).
 */
export function deriveSharedKey(peerPubKeyB64: string, mySecretKeyB64: string): Uint8Array {
  const peerPublicKey = naclUtil.decodeBase64(peerPubKeyB64);
  const mySecretKey = naclUtil.decodeBase64(mySecretKeyB64);
  return nacl.box.before(peerPublicKey, mySecretKey);
}

/**
 * Encrypt a UTF-8 message using a precomputed shared key.
 *
 * @param sharedKey Uint8Array shared key from deriveSharedKey.
 * @param message UTF-8 string to encrypt.
 * @returns Base64 encoded ciphertext and nonce.
 */
export function encryptMessage(
  sharedKey: Uint8Array,
  message: string,
): { ciphertext: string; nonce: string } {
  const nonce = nacl.randomBytes(24);
  const messageBytes = naclUtil.decodeUTF8(message);
  const box = nacl.secretbox(messageBytes, nonce, sharedKey);

  return {
    ciphertext: naclUtil.encodeBase64(box),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

/**
 * Decrypt Base64 encoded ciphertext using the shared key and nonce.
 *
 * @param sharedKey Uint8Array shared key from deriveSharedKey.
 * @param ciphertextB64 Base64 encoded ciphertext.
 * @param nonceB64 Base64 encoded 24-byte nonce.
 * @returns Decrypted UTF-8 string or null if authentication fails.
 */
export function decryptMessage(
  sharedKey: Uint8Array,
  ciphertextB64: string,
  nonceB64: string,
): string | null {
  const ciphertext = naclUtil.decodeBase64(ciphertextB64);
  const nonce = naclUtil.decodeBase64(nonceB64);
  const decrypted = nacl.secretbox.open(ciphertext, nonce, sharedKey);

  if (!decrypted) {
    return null;
  }

  return naclUtil.encodeUTF8(decrypted);
}
