export async function genKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}
export async function exportKeyJwk(key: CryptoKey) {
  return crypto.subtle.exportKey("jwk", key);
}
export async function importKeyJwk(jwk: JsonWebKey) {
  return crypto.subtle.importKey("jwk", jwk, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}
export async function encryptBytes(key: CryptoKey, data: ArrayBuffer) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { ciphertext: new Uint8Array(ct), iv };
}
export async function decryptBytes(key: CryptoKey, ciphertext: Uint8Array, iv: Uint8Array) {
  return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
}