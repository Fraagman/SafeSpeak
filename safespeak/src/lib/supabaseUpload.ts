/**
 * Client helper utilities for Supabase signed uploads.
 * Expected path format: "evidence/<uid>/<reportId>/file.bin".
 */

const SIGN_UPLOAD_ENDPOINT = "/api/supabase/sign-upload";
const PATH_PREFIX = "evidence/";
const MIN_PATH_LENGTH = 8;
const MAX_PATH_LENGTH = 300;

type SignedUploadResponse = {
  signedUrl: string;
  path: string;
  expiresAt: number;
};

type UploadOptions = {
  expiresIn?: number;
  upsert?: boolean;
};

function ensureValidPath(path: string): string {
  const trimmed = path.trim();

  if (!trimmed.startsWith(PATH_PREFIX)) {
    throw new Error('Upload path must start with "evidence/".');
  }

  if (trimmed.length < MIN_PATH_LENGTH || trimmed.length > MAX_PATH_LENGTH) {
    throw new Error("Upload path length must be between 8 and 300 characters.");
  }

  return trimmed;
}

function assertSignedUploadResponse(payload: unknown): SignedUploadResponse {
  if (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { signedUrl?: unknown }).signedUrl === "string" &&
    typeof (payload as { path?: unknown }).path === "string" &&
    typeof (payload as { expiresAt?: unknown }).expiresAt === "number"
  ) {
    return payload as SignedUploadResponse;
  }

  throw new Error("Unexpected response payload from upload signer.");
}

/**
 * Fetches a signed upload URL for the given path.
 */
export async function getSignedUploadUrl(
  path: string,
  opts: UploadOptions = {},
): Promise<SignedUploadResponse> {
  const safePath = ensureValidPath(path);

  const response = await fetch(SIGN_UPLOAD_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: safePath, ...opts }),
  });

  if (!response.ok) {
    const errorText = await extractErrorText(response);
    throw new Error(`Failed to fetch signed upload URL: ${errorText}`);
  }

  const json = (await response.json()) as unknown;
  return assertSignedUploadResponse(json);
}

/**
 * Uploads binary data directly to the supplied signed URL.
 */
export async function putToSignedUrl(
  signedUrl: string,
  data: Blob | ArrayBuffer | Uint8Array,
): Promise<{ ok: true }> {
  const body = normalizeBody(data);

  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      "x-upsert": "true",
    },
    body,
  });

  if (!response.ok) {
    const errorText = await extractErrorText(response);
    throw new Error(`Failed to upload to signed URL: ${errorText}`);
  }

  return { ok: true } as const;
}

/**
 * Convenience helper that obtains a signed upload URL and uploads the provided blob.
 */
export async function uploadCiphertextViaSupabase(
  path: string,
  blob: Blob,
): Promise<{ path: string; expiresAt: number }> {
  const { signedUrl, expiresAt } = await getSignedUploadUrl(path);
  await putToSignedUrl(signedUrl, blob);
  return { path, expiresAt };
}

async function extractErrorText(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as unknown;
    if (typeof payload === "object" && payload !== null) {
      const errorValue = (payload as { error?: unknown }).error;
      if (typeof errorValue === "string" && errorValue.trim()) {
        return `${response.status} ${response.statusText}: ${errorValue}`;
      }
    }
  } catch {
    // Ignore JSON parsing errors; fall back to text.
  }

  try {
    const text = await response.text();
    if (text.trim()) {
      return `${response.status} ${response.statusText}: ${text}`;
    }
  } catch {
    // Ignore text parsing errors.
  }

  return `${response.status} ${response.statusText}`;
}

function normalizeBody(data: Blob | ArrayBuffer | Uint8Array): BodyInit {
  if (data instanceof Blob) {
    return data;
  }

  if (data instanceof ArrayBuffer) {
    return data;
  }

  if (data instanceof Uint8Array) {
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }

  throw new Error("Unsupported data type for upload body.");
}
