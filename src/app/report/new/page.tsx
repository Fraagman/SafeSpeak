"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Helper function to safely convert ArrayBufferLike to ArrayBuffer
function toArrayBuffer(bufferLike: ArrayBuffer | SharedArrayBuffer | ArrayBufferView): ArrayBuffer {
  if (bufferLike instanceof ArrayBuffer) {
    return bufferLike;
  }
  
  if ('buffer' in bufferLike) {
    return bufferLike.buffer.slice(
      bufferLike.byteOffset,
      bufferLike.byteOffset + bufferLike.byteLength
    );
  }
  
  // For SharedArrayBuffer, create a new ArrayBuffer and copy the data
  const newBuffer = new ArrayBuffer(bufferLike.byteLength);
  new Uint8Array(newBuffer).set(new Uint8Array(bufferLike));
  return newBuffer;
}
import { ensureAnon, auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { genKey, encryptBytes, exportKeyJwk } from "@/lib/crypto";
import { sha256Hex } from "@/lib/hash";
import { blurFaces, fileToCanvas } from "@/lib/imageBlur";
import { uploadCiphertextViaSupabase } from "@/lib/supabaseUpload";

type StepId = "blur" | "encrypt" | "upload" | "classify" | "anchor" | "save";
type StepStatus = "idle" | "active" | "ok" | "fail" | "skip";

interface StepItem {
  id: StepId;
  label: string;
  status: StepStatus;
  note?: string;
  error?: string;
}

const INITIAL_STEPS: StepItem[] = [
  { id: "blur", label: "Blurring image", status: "idle" },
  { id: "encrypt", label: "Encrypting evidence", status: "idle" },
  { id: "upload", label: "Uploading to storage", status: "idle" },
  { id: "classify", label: "Classifying report", status: "idle" },
  { id: "anchor", label: "Anchoring hash", status: "idle" },
  { id: "save", label: "Saving report", status: "idle" },
];

export default function NewReport() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [redacted, setRedacted] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<"sepolia" | "amoy">("sepolia");
  const [steps, setSteps] = useState<StepItem[]>(INITIAL_STEPS);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);
  const [compress, setCompress] = useState(true);

  useEffect(() => {
    ensureAnon();
  }, []);

  useEffect(() => {
    if (imgFile) {
      const url = URL.createObjectURL(imgFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imgFile]);

  const updateStep = useCallback((id: StepId, updates: Partial<StepItem>) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  }, []);

  const startStep = useCallback((id: StepId) => {
    updateStep(id, { status: "active", error: undefined });
  }, [updateStep]);

  const finishStep = useCallback((id: StepId, note?: string) => {
    updateStep(id, { status: "ok", note });
  }, [updateStep]);

  const failStep = useCallback((id: StepId, error: string) => {
    console.error(`[${id.toUpperCase()}] Error:`, error);
    updateStep(id, { status: "fail", error });
  }, [updateStep]);

  const skipStep = useCallback((id: StepId, note?: string) => {
    updateStep(id, { status: "skip", note });
  }, [updateStep]);

  const renderStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'active': return <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>;
      case 'ok': return <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>;
      case 'fail': return <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</div>;
      case 'skip': return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
      default: return <div className="w-4 h-4 border border-gray-300 rounded-full"></div>;
    }
  };

  async function handleRedact() {
    try {
      const r = await fetch("/api/redact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
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
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      const reportId = crypto.randomUUID();
      const basePath = `evidence/${user.uid}/${reportId}`;
      let processedImageBlob: Blob | null = null;
      let fileSha256 = "";
      let txHash = "";
      let explorer = network === "amoy" 
        ? "https://amoy.polygonscan.com/tx/" 
        : "https://sepolia.etherscan.com/tx/";
      
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
              const canvas = await fileToCanvas(imgFile, 1920);
              // Create a new compressed file
              const compressedBlob = await new Promise<Blob>((res) => 
                canvas.toBlob(b => res(b!), "image/jpeg", 0.85)
              );
              compressionNote = `, compressed to ${canvas.width}x${canvas.height}`;
              sourceFile = new File([compressedBlob], imgFile.name, { 
                type: 'image/jpeg',
                lastModified: Date.now()
              });
            }
            
            processedImageBlob = await blurFaces(sourceFile, { maxSize: 1920 });
            finishStep("blur", `Faces detected and blurred${compressionNote}`);
          } catch (blurError) {
            console.warn("Face detection failed, falling back to EXIF strip:", blurError);
            const canvas = await fileToCanvas(imgFile, 1920);
            processedImageBlob = await new Promise(res => 
              canvas.toBlob(b => res(b!), "image/jpeg", 0.85)
            );
            failStep("blur", `Face detection failed; EXIF stripped only, compressed to ${canvas.width}x${canvas.height}`);
          }
        } else {
          skipStep("blur", "No image to process");
        }
      } catch (e) {
        failStep("blur", e instanceof Error ? e.message : "Unknown error");
        throw e;
      } finally {
        console.timeEnd("[BLUR]");
      }

      // ENCRYPT STEP
      startStep("encrypt");
      console.time("[ENCRYPT]");
      let key: CryptoKey;
      let keyJwk: JsonWebKey;
      let textEnc: { ciphertext: Uint8Array; iv: Uint8Array };
      let imgEnc: { ciphertext: Uint8Array; iv: Uint8Array } | null = null;

      try {
        key = await genKey();
        keyJwk = await exportKeyJwk(key);
        setRecoveryKey(JSON.stringify(keyJwk));
        setShowRecoveryKey(true);

        const source = redacted || text;
        // Convert text to Uint8Array and ensure we have a proper ArrayBuffer
        const textBuf = new TextEncoder().encode(source);
        textEnc = await encryptBytes(key, toArrayBuffer(textBuf));

        if (processedImageBlob) {
          // Get image as ArrayBuffer and ensure it's a proper ArrayBuffer
          const imgArrayBuffer = await processedImageBlob.arrayBuffer();
          imgEnc = await encryptBytes(key, toArrayBuffer(imgArrayBuffer));
        }

        const note = `text: ${textEnc.ciphertext.length}B${
          imgEnc ? `, image: ${imgEnc.ciphertext.length}B` : ""
        }`;
        finishStep("encrypt", note);
      } catch (e) {
        failStep("encrypt", e instanceof Error ? e.message : "Encryption failed");
        throw e;
      } finally {
        console.timeEnd("[ENCRYPT]");
      }

      // UPLOAD STEP
      startStep("upload");
      console.time("[UPLOAD]");
      let textPath = '';
      let imagePath = '';
      
      try {
        // Upload text
        const textBlob = new Blob([textEnc.ciphertext]);
        const textResult = await uploadCiphertextViaSupabase(
          `evidence/${user.uid}/${reportId}/text.bin`,
          textBlob
        );
        textPath = textResult.path;
        
        // Upload image if exists
        if (imgEnc) {
          const imageBlob = new Blob([imgEnc.ciphertext]);
          const imageResult = await uploadCiphertextViaSupabase(
            `evidence/${user.uid}/${reportId}/image.bin`,
            imageBlob
          );
          imagePath = imageResult.path;
        }
        
        const note = `Uploaded ${imgEnc ? 'text and image' : 'text'} to Supabase`;
        finishStep("upload", note);
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Upload failed";
        failStep("upload", errorMsg);
        throw new Error(`Upload failed: ${errorMsg}`);
      } finally {
        console.timeEnd("[UPLOAD]");
      }

      // Calculate file hash for integrity check
      const integrityBuf = imgEnc ? imgEnc.ciphertext.buffer : textEnc.ciphertext.buffer;
      fileSha256 = await sha256Hex(integrityBuf);

      // CLASSIFY STEP (optional)
      startStep("classify");
      console.time("[CLASSIFY]");
      let classification = { tags: [] as string[], severity: 3, urgency: "medium", summary: "" };
      
      try {
        const source = redacted || text;
        const cRes = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: source })
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
      } finally {
        console.timeEnd("[CLASSIFY]");
      }

      // ANCHOR STEP (optional)
      startStep("anchor");
      console.time("[ANCHOR]");
      
      try {
        const aRes = await fetch("/api/anchor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      } finally {
        console.timeEnd("[ANCHOR]");
      }

      // SAVE STEP
      startStep("save");
      console.time("[SAVE]");
      
      try {
        await setDoc(doc(db, "reports", reportId), {
          ownerUid: user.uid,
          createdAt: serverTimestamp(),
          tags: classification.tags,
          severity: classification.severity,
          urgency: classification.urgency,
          summary: classification.summary,
          textPath,
          ...(imagePath && { imagePath }),
          fileSha256,
          anchorTxHash: txHash,
          anchorExplorer: explorer,
          anchorNetwork: network,
          status: "new"
        });
        
        finishStep("save", "Report saved successfully");
        console.timeEnd("[SAVE]");
        
        // Navigate to report view after a short delay to show completion
        setTimeout(() => {
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">New Report</h2>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe what happened
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what happened..."
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={handleRedact}
              disabled={!text.trim() || loading}
              className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Redact PII
            </button>
            
            <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
              <span className="text-sm font-medium">Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImgFile(e.target.files?.[0] || null)}
                className="hidden"
                disabled={loading}
              />
            </label>
            
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-600">Network:</span>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as any)}
                className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="sepolia">Sepolia (Ethereum)</option>
                <option value="amoy">Polygon Amoy</option>
              </select>
            </div>
          </div>
          
          {redacted && (
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-1">Redacted Preview:</h3>
              <p className="whitespace-pre-wrap text-slate-700">{redacted}</p>
            </div>
          )}
          
          {previewUrl && (
            <div className="border border-gray-200 rounded-md p-2">
              <div className="text-sm text-gray-600 mb-1">Image Preview:</div>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 max-w-full rounded-md object-contain border border-gray-200"
              />
            </div>
          )}
          
          <div className="space-y-3 pt-2">
            {imgFile && (
              <div className="flex items-start space-x-2">
                <div className="flex items-center h-5">
                  <input
                    id="compress-toggle"
                    type="checkbox"
                    checked={compress}
                    onChange={(e) => setCompress(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    disabled={loading}
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="compress-toggle" className="font-medium text-gray-700">
                    Compress large images
                  </label>
                  <p className="text-xs text-gray-500">
                    Resize large images before blur (faster, safer)
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={onSubmit}
              disabled={loading || !text.trim()}
              className={`w-full py-3 px-4 rounded-md font-medium ${
                loading || !text.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
          <div 
            className="space-y-3 text-sm"
            aria-live="polite"
            aria-atomic="true"
          >
            {steps.map((step) => (
              <div key={step.id} className="flex items-start space-x-2">
                <div className="mt-0.5">
                  {renderStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className={`font-medium ${
                      step.status === 'fail' ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {step.label}
                    </span>
                    {step.note && (
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {step.note}
                      </span>
                    )}
                  </div>
                  {step.error && (
                    <div className="mt-1 text-xs text-red-500 bg-red-50 p-2 rounded">
                      {step.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {showRecoveryKey && recoveryKey && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-800">Recovery Key</h4>
                <button
                  onClick={() => navigator.clipboard.writeText(recoveryKey)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy
                </button>
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  value={recoveryKey}
                  className="w-full h-32 p-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                />
                <div className="absolute top-2 right-2 text-xs text-gray-500">
                  {recoveryKey.length} chars
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Save this key securely. You'll need it to access your report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}