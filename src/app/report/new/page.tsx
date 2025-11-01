"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureAnon, auth, db, storage } from "@/lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { genKey, encryptBytes, exportKeyJwk } from "@/lib/crypto";
import { sha256Hex } from "@/lib/hash";
import { blurFaces } from "@/lib/imageBlur";

export default function NewReport() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [redacted, setRedacted] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<"sepolia" | "amoy">("sepolia");

  useEffect(() => { ensureAnon(); }, []);
  useEffect(() => {
    if (imgFile) { const url = URL.createObjectURL(imgFile); setPreviewUrl(url); return () => URL.revokeObjectURL(url); }
  }, [imgFile]);

  async function handleRedact() {
    const r = await fetch("/api/redact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    const j = await r.json(); if (j.error) return alert(j.error); setRedacted(j.redacted || text);
  }

  async function onSubmit() {
    if (!text.trim()) return alert("Please enter a description.");
    setLoading(true);
    try {
      const user = auth.currentUser!; const reportId = crypto.randomUUID();
      const basePath = `evidence/${user.uid}/${reportId}`;

      let processedImageBlob: Blob | null = null;
      if (imgFile) processedImageBlob = await blurFaces(imgFile);

      const key = await genKey(); const keyJwk = await exportKeyJwk(key);
      setRecoveryKey(JSON.stringify(keyJwk));

      const source = redacted || text;
      const textBuf = new TextEncoder().encode(source).buffer;
      const textEnc = await encryptBytes(key, textBuf);

      let imgEnc: { ciphertext: Uint8Array; iv: Uint8Array } | null = null;
      if (processedImageBlob) { const imgArray = await processedImageBlob.arrayBuffer(); imgEnc = await encryptBytes(key, imgArray); }

      await uploadBytes(ref(storage, `${basePath}/text.bin`), new Blob([textEnc.ciphertext]));
      if (imgEnc) await uploadBytes(ref(storage, `${basePath}/image.bin`), new Blob([imgEnc.ciphertext]));

      const integrityBuf = imgEnc ? imgEnc.ciphertext.buffer : textEnc.ciphertext.buffer;
      const fileSha256 = await sha256Hex(integrityBuf);

      const cRes = await fetch("/api/classify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: source }) });
      const c = await cRes.json(); if (c.error) console.warn("classify error:", c.error);

      let txHash = ""; let explorer = network === "amoy" ? "https://amoy.polygonscan.com/tx/" : "https://sepolia.etherscan.io/tx/";
      try {
        const aRes = await fetch("/api/anchor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sha256Hex: fileSha256, network: network==="amoy"?"amoy":undefined }) });
        const a = await aRes.json(); if (!a.error) { txHash = a.txHash || ""; explorer = a.explorer || explorer; }
      } catch (e) { console.warn("anchor failed:", e); }

      await setDoc(doc(db, "reports", reportId), {
        ownerUid: user.uid, createdAt: serverTimestamp(),
        tags: c.tags || [], severity: c.severity ?? 3, urgency: c.urgency || "medium", summary: c.summary || "",
        encryptedBlobPath: basePath, fileSha256, anchorTxHash: txHash, anchorExplorer: explorer, anchorNetwork: network, status: "new"
      });

      alert("Report submitted. Save your recovery key.");
      router.push(`/report/${reportId}`);
    } catch (e: any) { console.error(e); alert(e.message || "Error submitting report"); }
    finally { setLoading(false); }
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">New Report</h2>
      <label className="block text-sm font-medium">Describe what happened</label>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={8} className="w-full border p-2 rounded" placeholder="Describe what happened..." />
      <div className="flex items-center gap-3">
        <button onClick={handleRedact} className="bg-slate-800 text-white px-3 py-2 rounded">Redact PII</button>
        <input type="file" accept="image/*" onChange={(e)=>setImgFile(e.target.files?.[0] || null)} />
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm">Anchor network:</label>
        <select value={network} onChange={(e)=>setNetwork(e.target.value as any)} className="border rounded p-2">
          <option value="sepolia">Sepolia (Ethereum)</option>
          <option value="amoy">Polygon Amoy</option>
        </select>
      </div>
      {redacted && (<div className="p-3 bg-slate-100 rounded"><strong>Redacted Preview:</strong><p className="whitespace-pre-wrap">{redacted}</p></div>)}
      {previewUrl && (<div className="p-2"><div className="text-sm mb-1">Image preview (face-blurred + EXIF-stripped):</div><img src={previewUrl} alt="preview" className="max-h-64 rounded border" /></div>)}
      <button disabled={loading} onClick={onSubmit} className="bg-emerald-600 text-white px-4 py-2 rounded">{loading ? "Submitting..." : "Submit Report"}</button>
      {recoveryKey && (<div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <div className="font-semibold mb-1">Recovery Key (save securely):</div>
        <textarea readOnly className="w-full border p-2 rounded text-xs" rows={5} value={recoveryKey} />
      </div>)}
    </main>
  );
}