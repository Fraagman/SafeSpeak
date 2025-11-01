(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/crypto.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decryptBytes",
    ()=>decryptBytes,
    "encryptBytes",
    ()=>encryptBytes,
    "exportKeyJwk",
    ()=>exportKeyJwk,
    "genKey",
    ()=>genKey,
    "importKeyJwk",
    ()=>importKeyJwk
]);
async function genKey() {
    return crypto.subtle.generateKey({
        name: "AES-GCM",
        length: 256
    }, true, [
        "encrypt",
        "decrypt"
    ]);
}
async function exportKeyJwk(key) {
    return crypto.subtle.exportKey("jwk", key);
}
async function importKeyJwk(jwk) {
    return crypto.subtle.importKey("jwk", jwk, {
        name: "AES-GCM"
    }, true, [
        "encrypt",
        "decrypt"
    ]);
}
async function encryptBytes(key, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({
        name: "AES-GCM",
        iv
    }, key, data);
    return {
        ciphertext: new Uint8Array(ct),
        iv
    };
}
async function decryptBytes(key, ciphertext, iv) {
    return crypto.subtle.decrypt({
        name: "AES-GCM",
        iv
    }, key, ciphertext);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/hash.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sha256Hex",
    ()=>sha256Hex
]);
async function sha256Hex(buf) {
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash)).map((b)=>b.toString(16).padStart(2, "0")).join("");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/imageBlur.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blurFaces",
    ()=>blurFaces,
    "fileToCanvas",
    ()=>fileToCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f40$tensorflow$2f$tfjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/@tensorflow/tfjs/dist/index.js [app-client] (ecmascript) <locals>");
;
async function fileToCanvas(file, maxSize = 1920) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const img = new Image();
    const url = URL.createObjectURL(file);
    await new Promise((resolve, reject)=>{
        img.onload = ()=>{
            URL.revokeObjectURL(url);
            resolve();
        };
        img.onerror = ()=>{
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        img.src = url;
    });
    // Calculate new dimensions while maintaining aspect ratio
    let { width, height } = img;
    if (width > height && width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
    } else if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
}
/**
 * Detects faces in an image using the best available method
 * @param canvas Canvas element containing the image
 * @returns Array of face rectangles
 */ async function detectFacesRects(canvas) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Try native FaceDetector API first if available and in secure context
    const anyWin = window;
    if (anyWin.FaceDetector && window.isSecureContext) {
        try {
            const detector = new anyWin.FaceDetector({
                fastMode: true,
                maxDetectedFaces: 10
            });
            const faces = await detector.detect(canvas);
            return faces.map((f)=>({
                    x: Math.max(0, f.boundingBox.x - f.boundingBox.width * 0.2),
                    y: Math.max(0, f.boundingBox.y - f.boundingBox.height * 0.2),
                    width: Math.min(canvas.width - f.boundingBox.x, f.boundingBox.width * 1.4),
                    height: Math.min(canvas.height - f.boundingBox.y, f.boundingBox.height * 1.4)
                }));
        } catch (error) {
            console.warn('FaceDetector API failed, falling back to TensorFlow.js', error);
        }
    }
    // Fall back to TensorFlow.js
    try {
        // Dynamically import TF.js and BlazeFace to reduce initial bundle size
        const [tf, blazeface] = await Promise.all([
            __turbopack_context__.A("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/@tensorflow/tfjs/dist/index.js [app-client] (ecmascript, async loader)"),
            __turbopack_context__.A("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/@tensorflow-models/blazeface/dist/blazeface.esm.js [app-client] (ecmascript, async loader)")
        ]);
        await tf.ready();
        await tf.setBackend('webgl');
        const model = await blazeface.load();
        const predictions = await model.estimateFaces(canvas, false);
        return predictions.map((pred)=>{
            const [x1, y1] = pred.topLeft;
            const [x2, y2] = pred.bottomRight;
            const width = x2 - x1;
            const height = y2 - y1;
            return {
                x: Math.max(0, x1 - width * 0.2),
                y: Math.max(0, y1 - height * 0.2),
                width: Math.min(canvas.width - x1, width * 1.4),
                height: Math.min(canvas.height - y1, height * 1.4)
            };
        });
    } catch (error) {
        console.error('Face detection failed:', error);
        return [];
    }
}
/**
 * Applies pixelation to a region of a canvas
 * @param ctx Canvas rendering context
 * @param rect Region to pixelate
 * @param scale Pixelation scale (0-1, lower = more pixelated)
 */ function pixelateRegion(ctx, rect, scale = 0.05) {
    const { x, y, width, height } = rect;
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = Math.max(1, Math.floor(w * scale));
    tempCanvas.height = Math.max(1, Math.floor(h * scale));
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(ctx.canvas, x, y, w, h, 0, 0, tempCanvas.width, tempCanvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, x, y, w, h);
    ctx.imageSmoothingEnabled = true;
}
async function blurFaces(file, opts = {}) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const { pixelateScale = 0.05, maxSize = 1920 } = opts;
    try {
        // Load and resize the image
        const canvas = await fileToCanvas(file, maxSize);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        // Detect faces
        const faceRects = await detectFacesRects(canvas);
        // Apply pixelation to each detected face
        for (const rect of faceRects){
            pixelateRegion(ctx, rect, pixelateScale);
        }
        // Convert to blob with JPEG format and quality 0.85 (strips EXIF data)
        return new Promise((resolve, reject)=>{
            canvas.toBlob((blob)=>{
                if (!blob) {
                    reject(new Error('Failed to create blob from canvas'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg', 0.85);
        });
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error(`Failed to process image: ${error instanceof Error ? error.message : String(error)}`);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/supabaseUpload.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Client helper utilities for Supabase signed uploads.
 * Expected path format: "evidence/<uid>/<reportId>/file.bin".
 */ __turbopack_context__.s([
    "getSignedUploadUrl",
    ()=>getSignedUploadUrl,
    "putToSignedUrl",
    ()=>putToSignedUrl,
    "uploadCiphertextViaSupabase",
    ()=>uploadCiphertextViaSupabase
]);
const SIGN_UPLOAD_ENDPOINT = "/api/supabase/sign-upload";
const PATH_PREFIX = "evidence/";
const MIN_PATH_LENGTH = 8;
const MAX_PATH_LENGTH = 300;
function ensureValidPath(path) {
    const trimmed = path.trim();
    if (!trimmed.startsWith(PATH_PREFIX)) {
        throw new Error('Upload path must start with "evidence/".');
    }
    if (trimmed.length < MIN_PATH_LENGTH || trimmed.length > MAX_PATH_LENGTH) {
        throw new Error("Upload path length must be between 8 and 300 characters.");
    }
    return trimmed;
}
function assertSignedUploadResponse(payload) {
    if (typeof payload === "object" && payload !== null && typeof payload.signedUrl === "string" && typeof payload.path === "string" && typeof payload.expiresAt === "number") {
        return payload;
    }
    throw new Error("Unexpected response payload from upload signer.");
}
async function getSignedUploadUrl(path, opts = {}) {
    const safePath = ensureValidPath(path);
    const response = await fetch(SIGN_UPLOAD_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            path: safePath,
            ...opts
        })
    });
    if (!response.ok) {
        const errorText = await extractErrorText(response);
        throw new Error(`Failed to fetch signed upload URL: ${errorText}`);
    }
    const json = await response.json();
    return assertSignedUploadResponse(json);
}
async function putToSignedUrl(signedUrl, data) {
    const body = normalizeBody(data);
    const response = await fetch(signedUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/octet-stream",
            "x-upsert": "true"
        },
        body
    });
    if (!response.ok) {
        const errorText = await extractErrorText(response);
        throw new Error(`Failed to upload to signed URL: ${errorText}`);
    }
    return {
        ok: true
    };
}
async function uploadCiphertextViaSupabase(path, blob) {
    const { signedUrl, expiresAt } = await getSignedUploadUrl(path);
    await putToSignedUrl(signedUrl, blob);
    return {
        path,
        expiresAt
    };
}
async function extractErrorText(response) {
    try {
        const payload = await response.json();
        if (typeof payload === "object" && payload !== null) {
            const errorValue = payload.error;
            if (typeof errorValue === "string" && errorValue.trim()) {
                return `${response.status} ${response.statusText}: ${errorValue}`;
            }
        }
    } catch  {
    // Ignore JSON parsing errors; fall back to text.
    }
    try {
        const text = await response.text();
        if (text.trim()) {
            return `${response.status} ${response.statusText}: ${text}`;
        }
    } catch  {
    // Ignore text parsing errors.
    }
    return `${response.status} ${response.statusText}`;
}
function normalizeBody(data) {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewReport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/crypto.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$hash$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/hash.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$imageBlur$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/imageBlur.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$supabaseUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/web/SafeSpeak/src/lib/supabaseUpload.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// Helper function to safely convert ArrayBufferLike to ArrayBuffer
function toArrayBuffer(bufferLike) {
    if (bufferLike instanceof ArrayBuffer) {
        return bufferLike;
    }
    if ('buffer' in bufferLike) {
        return bufferLike.buffer.slice(bufferLike.byteOffset, bufferLike.byteOffset + bufferLike.byteLength);
    }
    // For SharedArrayBuffer, create a new ArrayBuffer and copy the data
    const newBuffer = new ArrayBuffer(bufferLike.byteLength);
    new Uint8Array(newBuffer).set(new Uint8Array(bufferLike));
    return newBuffer;
}
;
;
;
;
;
;
const INITIAL_STEPS = [
    {
        id: "blur",
        label: "Blurring image",
        status: "idle"
    },
    {
        id: "encrypt",
        label: "Encrypting evidence",
        status: "idle"
    },
    {
        id: "upload",
        label: "Uploading to storage",
        status: "idle"
    },
    {
        id: "classify",
        label: "Classifying report",
        status: "idle"
    },
    {
        id: "anchor",
        label: "Anchoring hash",
        status: "idle"
    },
    {
        id: "save",
        label: "Saving report",
        status: "idle"
    }
];
function NewReport() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [redacted, setRedacted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [imgFile, setImgFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewUrl, setPreviewUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recoveryKey, setRecoveryKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [network, setNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("sepolia");
    const [steps, setSteps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_STEPS);
    const [showRecoveryKey, setShowRecoveryKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [compress, setCompress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewReport.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureAnon"])();
        }
    }["NewReport.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewReport.useEffect": ()=>{
            if (imgFile) {
                const url = URL.createObjectURL(imgFile);
                setPreviewUrl(url);
                return ({
                    "NewReport.useEffect": ()=>URL.revokeObjectURL(url)
                })["NewReport.useEffect"];
            }
        }
    }["NewReport.useEffect"], [
        imgFile
    ]);
    const updateStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewReport.useCallback[updateStep]": (id, updates)=>{
            setSteps({
                "NewReport.useCallback[updateStep]": (prev)=>prev.map({
                        "NewReport.useCallback[updateStep]": (step)=>step.id === id ? {
                                ...step,
                                ...updates
                            } : step
                    }["NewReport.useCallback[updateStep]"])
            }["NewReport.useCallback[updateStep]"]);
        }
    }["NewReport.useCallback[updateStep]"], []);
    const startStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewReport.useCallback[startStep]": (id)=>{
            updateStep(id, {
                status: "active",
                error: undefined
            });
        }
    }["NewReport.useCallback[startStep]"], [
        updateStep
    ]);
    const finishStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewReport.useCallback[finishStep]": (id, note)=>{
            updateStep(id, {
                status: "ok",
                note
            });
        }
    }["NewReport.useCallback[finishStep]"], [
        updateStep
    ]);
    const failStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewReport.useCallback[failStep]": (id, error)=>{
            console.error(`[${id.toUpperCase()}] Error:`, error);
            updateStep(id, {
                status: "fail",
                error
            });
        }
    }["NewReport.useCallback[failStep]"], [
        updateStep
    ]);
    const skipStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewReport.useCallback[skipStep]": (id, note)=>{
            updateStep(id, {
                status: "skip",
                note
            });
        }
    }["NewReport.useCallback[skipStep]"], [
        updateStep
    ]);
    const renderStatusIcon = (status)=>{
        switch(status){
            case 'active':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                    lineNumber: 100,
                    columnNumber: 29
                }, this);
            case 'ok':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs",
                    children: "✓"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                    lineNumber: 101,
                    columnNumber: 25
                }, this);
            case 'fail':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs",
                    children: "✗"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                    lineNumber: 102,
                    columnNumber: 27
                }, this);
            case 'skip':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 bg-gray-300 rounded-full"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                    lineNumber: 103,
                    columnNumber: 27
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 border border-gray-300 rounded-full"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                    lineNumber: 104,
                    columnNumber: 23
                }, this);
        }
    };
    async function handleRedact() {
        try {
            const r = await fetch("/api/redact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text
                })
            });
            const j = await r.json();
            if (j.error) throw new Error(j.error);
            setRedacted(j.redacted || text);
        } catch (error) {
            console.error("Redaction failed:", error);
            alert("Failed to redact PII. Please try again.");
        }
    }
    async function onSubmit() {
        if (!text.trim()) return alert("Please enter a description.");
        setLoading(true);
        setSteps(INITIAL_STEPS);
        setShowRecoveryKey(false);
        try {
            const user = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser;
            if (!user) throw new Error("User not authenticated");
            const reportId = crypto.randomUUID();
            const basePath = `evidence/${user.uid}/${reportId}`;
            let processedImageBlob = null;
            let fileSha256 = "";
            let txHash = "";
            let explorer = network === "amoy" ? "https://amoy.polygonscan.com/tx/" : "https://sepolia.etherscan.com/tx/";
            // BLUR STEP
            startStep("blur");
            console.time("[BLUR]");
            try {
                if (imgFile) {
                    try {
                        let sourceFile = imgFile;
                        let compressionNote = '';
                        // Compress image if enabled and it's an image
                        if (compress && imgFile.type.startsWith('image/')) {
                            const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$imageBlur$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileToCanvas"])(imgFile, 1920);
                            // Create a new compressed file
                            const compressedBlob = await new Promise((res)=>canvas.toBlob((b)=>res(b), "image/jpeg", 0.85));
                            compressionNote = `, compressed to ${canvas.width}x${canvas.height}`;
                            sourceFile = new File([
                                compressedBlob
                            ], imgFile.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                        }
                        processedImageBlob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$imageBlur$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blurFaces"])(sourceFile, {
                            maxSize: 1920
                        });
                        finishStep("blur", `Faces detected and blurred${compressionNote}`);
                    } catch (blurError) {
                        console.warn("Face detection failed, falling back to EXIF strip:", blurError);
                        const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$imageBlur$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileToCanvas"])(imgFile, 1920);
                        processedImageBlob = await new Promise((res)=>canvas.toBlob((b)=>res(b), "image/jpeg", 0.85));
                        failStep("blur", `Face detection failed; EXIF stripped only, compressed to ${canvas.width}x${canvas.height}`);
                    }
                } else {
                    skipStep("blur", "No image to process");
                }
            } catch (e) {
                failStep("blur", e instanceof Error ? e.message : "Unknown error");
                throw e;
            } finally{
                console.timeEnd("[BLUR]");
            }
            // ENCRYPT STEP
            startStep("encrypt");
            console.time("[ENCRYPT]");
            let key;
            let keyJwk;
            let textEnc;
            let imgEnc = null;
            try {
                key = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["genKey"])();
                keyJwk = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportKeyJwk"])(key);
                setRecoveryKey(JSON.stringify(keyJwk));
                setShowRecoveryKey(true);
                const source = redacted || text;
                // Convert text to Uint8Array and ensure we have a proper ArrayBuffer
                const textBuf = new TextEncoder().encode(source);
                textEnc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encryptBytes"])(key, toArrayBuffer(textBuf));
                if (processedImageBlob) {
                    // Get image as ArrayBuffer and ensure it's a proper ArrayBuffer
                    const imgArrayBuffer = await processedImageBlob.arrayBuffer();
                    imgEnc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encryptBytes"])(key, toArrayBuffer(imgArrayBuffer));
                }
                const note = `text: ${textEnc.ciphertext.length}B${imgEnc ? `, image: ${imgEnc.ciphertext.length}B` : ""}`;
                finishStep("encrypt", note);
            } catch (e) {
                failStep("encrypt", e instanceof Error ? e.message : "Encryption failed");
                throw e;
            } finally{
                console.timeEnd("[ENCRYPT]");
            }
            // UPLOAD STEP
            startStep("upload");
            console.time("[UPLOAD]");
            let textPath = '';
            let imagePath = '';
            try {
                // Upload text
                const textBlob = new Blob([
                    textEnc.ciphertext
                ]);
                const textResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$supabaseUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadCiphertextViaSupabase"])(`evidence/${user.uid}/${reportId}/text.bin`, textBlob);
                textPath = textResult.path;
                // Upload image if exists
                if (imgEnc) {
                    const imageBlob = new Blob([
                        imgEnc.ciphertext
                    ]);
                    const imageResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$supabaseUpload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadCiphertextViaSupabase"])(`evidence/${user.uid}/${reportId}/image.bin`, imageBlob);
                    imagePath = imageResult.path;
                }
                const note = `Uploaded ${imgEnc ? 'text and image' : 'text'} to Supabase`;
                finishStep("upload", note);
            } catch (e) {
                const errorMsg = e instanceof Error ? e.message : "Upload failed";
                failStep("upload", errorMsg);
                throw new Error(`Upload failed: ${errorMsg}`);
            } finally{
                console.timeEnd("[UPLOAD]");
            }
            // Calculate file hash for integrity check
            const integrityBuf = imgEnc ? imgEnc.ciphertext.buffer : textEnc.ciphertext.buffer;
            fileSha256 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$hash$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256Hex"])(integrityBuf);
            // CLASSIFY STEP (optional)
            startStep("classify");
            console.time("[CLASSIFY]");
            let classification = {
                tags: [],
                severity: 3,
                urgency: "medium",
                summary: ""
            };
            try {
                const source = redacted || text;
                const cRes = await fetch("/api/classify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: source
                    })
                });
                if (cRes.ok) {
                    const c = await cRes.json();
                    if (c.tags) {
                        classification = {
                            tags: c.tags || [],
                            severity: c.severity ?? 3,
                            urgency: c.urgency || "medium",
                            summary: c.summary || ""
                        };
                        finishStep("classify", `Tags: ${c.tags.join(", ")}`);
                    } else {
                        skipStep("classify", "No classification data");
                    }
                } else {
                    throw new Error(`HTTP ${cRes.status}`);
                }
            } catch (e) {
                const errorMsg = e instanceof Error ? e.message : "Classification failed";
                failStep("classify", errorMsg);
                console.warn("Classification failed, continuing without:", e);
            } finally{
                console.timeEnd("[CLASSIFY]");
            }
            // ANCHOR STEP (optional)
            startStep("anchor");
            console.time("[ANCHOR]");
            try {
                const aRes = await fetch("/api/anchor", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sha256Hex: fileSha256,
                        network: network === "amoy" ? "amoy" : undefined
                    })
                });
                if (aRes.ok) {
                    const a = await aRes.json();
                    if (a.txHash) {
                        txHash = a.txHash;
                        explorer = a.explorer || explorer;
                        finishStep("anchor", `Tx: ${txHash.slice(0, 10)}…`);
                    } else {
                        skipStep("anchor", "No transaction hash received");
                    }
                } else {
                    throw new Error(`HTTP ${aRes.status}`);
                }
            } catch (e) {
                const errorMsg = e instanceof Error ? e.message : "Anchoring failed";
                failStep("anchor", errorMsg);
                console.warn("Anchoring failed, continuing without:", e);
            } finally{
                console.timeEnd("[ANCHOR]");
            }
            // SAVE STEP
            startStep("save");
            console.time("[SAVE]");
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "reports", reportId), {
                    ownerUid: user.uid,
                    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                    tags: classification.tags,
                    severity: classification.severity,
                    urgency: classification.urgency,
                    summary: classification.summary,
                    textPath,
                    ...imagePath && {
                        imagePath
                    },
                    fileSha256,
                    anchorTxHash: txHash,
                    anchorExplorer: explorer,
                    anchorNetwork: network,
                    status: "new"
                });
                finishStep("save", "Report saved successfully");
                console.timeEnd("[SAVE]");
                // Navigate to report view after a short delay to show completion
                setTimeout(()=>{
                    router.push(`/report/${reportId}`);
                }, 1000);
            } catch (e) {
                const errorMsg = e instanceof Error ? e.message : "Failed to save report";
                failStep("save", errorMsg);
                console.timeEnd("[SAVE]");
                throw e;
            }
        } catch (e) {
            console.error("Report submission failed:", e);
            alert(`Failed to submit report: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:col-span-2 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-gray-800",
                        children: "New Report"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                        lineNumber: 380,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow p-6 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Describe what happened"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 384,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: text,
                                        onChange: (e)=>setText(e.target.value),
                                        rows: 8,
                                        className: "w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                        placeholder: "Describe what happened...",
                                        disabled: loading
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 387,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                lineNumber: 383,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-3 items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleRedact,
                                        disabled: !text.trim() || loading,
                                        className: "bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                        children: "Redact PII"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: "Add Image"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                lineNumber: 407,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "image/*",
                                                onChange: (e)=>setImgFile(e.target.files?.[0] || null),
                                                className: "hidden",
                                                disabled: loading
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                lineNumber: 408,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 ml-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-600",
                                                children: "Network:"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                lineNumber: 418,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: network,
                                                onChange: (e)=>setNetwork(e.target.value),
                                                className: "border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                disabled: loading,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "sepolia",
                                                        children: "Sepolia (Ethereum)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "amoy",
                                                        children: "Polygon Amoy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                lineNumber: 419,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 417,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                lineNumber: 397,
                                columnNumber: 11
                            }, this),
                            redacted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 bg-slate-50 rounded-md border border-slate-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium text-slate-800 mb-1",
                                        children: "Redacted Preview:"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 433,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "whitespace-pre-wrap text-slate-700",
                                        children: redacted
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 434,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                lineNumber: 432,
                                columnNumber: 13
                            }, this),
                            previewUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-gray-200 rounded-md p-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600 mb-1",
                                        children: "Image Preview:"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 440,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: previewUrl,
                                        alt: "Preview",
                                        className: "max-h-64 max-w-full rounded-md object-contain border border-gray-200"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 441,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                lineNumber: 439,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3 pt-2",
                                children: [
                                    imgFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center h-5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "compress-toggle",
                                                    type: "checkbox",
                                                    checked: compress,
                                                    onChange: (e)=>setCompress(e.target.checked),
                                                    className: "h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500",
                                                    disabled: loading
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                lineNumber: 452,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "compress-toggle",
                                                        className: "font-medium text-gray-700",
                                                        children: "Compress large images"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                        lineNumber: 463,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-500",
                                                        children: "Resize large images before blur (faster, safer)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                        lineNumber: 466,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                lineNumber: 462,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 451,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onSubmit,
                                        disabled: loading || !text.trim(),
                                        className: `w-full py-3 px-4 rounded-md font-medium ${loading || !text.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`,
                                        children: loading ? 'Submitting...' : 'Submit Report'
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                        lineNumber: 473,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                lineNumber: 449,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                        lineNumber: 382,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                lineNumber: 379,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:col-span-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow p-6 sticky top-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-gray-800 mb-4",
                            children: "Status"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                            lineNumber: 490,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 text-sm",
                            "aria-live": "polite",
                            "aria-atomic": "true",
                            children: steps.map((step)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-0.5",
                                            children: renderStatusIcon(step.status)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                            lineNumber: 498,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-start",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `font-medium ${step.status === 'fail' ? 'text-red-600' : 'text-gray-700'}`,
                                                            children: step.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                            lineNumber: 503,
                                                            columnNumber: 21
                                                        }, this),
                                                        step.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500 ml-2 whitespace-nowrap",
                                                            children: step.note
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                            lineNumber: 509,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 19
                                                }, this),
                                                step.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 text-xs text-red-500 bg-red-50 p-2 rounded",
                                                    children: step.error
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                                    lineNumber: 515,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, step.id, true, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                    lineNumber: 497,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                            lineNumber: 491,
                            columnNumber: 11
                        }, this),
                        showRecoveryKey && recoveryKey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 pt-4 border-t border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium text-gray-800",
                                            children: "Recovery Key"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                            lineNumber: 527,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>navigator.clipboard.writeText(recoveryKey),
                                            className: "text-xs text-blue-600 hover:text-blue-800",
                                            children: "Copy"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                            lineNumber: 528,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                    lineNumber: 526,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            readOnly: true,
                                            value: recoveryKey,
                                            className: "w-full h-32 p-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                            lineNumber: 536,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-2 right-2 text-xs text-gray-500",
                                            children: [
                                                recoveryKey.length,
                                                " chars"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                            lineNumber: 541,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                    lineNumber: 535,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-xs text-gray-500",
                                    children: "Save this key securely. You'll need it to access your report."
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                                    lineNumber: 545,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                            lineNumber: 525,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                    lineNumber: 489,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
                lineNumber: 488,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/web/SafeSpeak/src/app/report/new/page.tsx",
        lineNumber: 378,
        columnNumber: 5
    }, this);
}
_s(NewReport, "+mlUfFLtuip0+oLmuW020aTHtRY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$web$2f$SafeSpeak$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = NewReport;
var _c;
__turbopack_context__.k.register(_c, "NewReport");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_Desktop_web_SafeSpeak_src_ef86ea4f._.js.map