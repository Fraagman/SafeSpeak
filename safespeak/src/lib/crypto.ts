const subtle = () => {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Crypto API is not available in this environment.");
  }
  return window.crypto.subtle;
};

const AES_ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH_BYTES = 12;

export async function genKey(): Promise<CryptoKey> {
  return subtle().generateKey(
    {
      name: AES_ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ["encrypt", "decrypt"],
  );
}

export async function exportKeyJwk(key: CryptoKey): Promise<JsonWebKey> {
  return subtle().exportKey("jwk", key);
}

export async function importKeyJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  return subtle().importKey("jwk", jwk, { name: AES_ALGORITHM }, true, ["encrypt", "decrypt"]);
}

function randomIv(): Uint8Array {
  if (typeof window === "undefined" || !window.crypto?.getRandomValues) {
    throw new Error("Web Crypto API is not available in this environment.");
  }
  const iv = new Uint8Array(IV_LENGTH_BYTES);
  window.crypto.getRandomValues(iv);
  return iv;
}

export async function encryptBytes(
  key: CryptoKey,
  data: ArrayBuffer,
): Promise<{ ciphertext: Uint8Array; iv: Uint8Array }> {
  const iv = randomIv();
  const encrypted = await subtle().encrypt(
    {
      name: AES_ALGORITHM,
      iv,
    },
    key,
    data,
  );

  return {
    ciphertext: new Uint8Array(encrypted),
    iv,
  };
}

export async function decryptBytes(
  key: CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
): Promise<ArrayBuffer> {
  return subtle().decrypt(
    {
      name: AES_ALGORITHM,
      iv,
    },
    key,
    ciphertext,
  );
}
