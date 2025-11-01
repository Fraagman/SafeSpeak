function getSubtle(): SubtleCrypto {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || typeof cryptoObj.subtle === "undefined") {
    throw new Error("Web Crypto API is not available in this environment.");
  }
  return cryptoObj.subtle;
}

async function normalizeInput(input: ArrayBuffer | Uint8Array | Blob | string): Promise<ArrayBuffer> {
  if (typeof input === "string") {
    return new TextEncoder().encode(input).buffer;
  }

  if (typeof Blob !== "undefined" && input instanceof Blob) {
    return input.arrayBuffer();
  }

  if (input instanceof Uint8Array) {
    const { buffer, byteOffset, byteLength } = input;
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }

  if (input instanceof ArrayBuffer || Object.prototype.toString.call(input) === "[object ArrayBuffer]") {
    return input as ArrayBuffer;
  }

  throw new TypeError("Unsupported input type for sha256Hex.");
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const hexCodes: string[] = new Array(bytes.length);

  for (let i = 0; i < bytes.length; i += 1) {
    hexCodes[i] = bytes[i].toString(16).padStart(2, "0");
  }

  return hexCodes.join("");
}

export async function sha256Hex(input: ArrayBuffer | Uint8Array | Blob | string): Promise<string> {
  const data = await normalizeInput(input);
  const digest = await getSubtle().digest("SHA-256", data);
  return bufferToHex(digest);
}
