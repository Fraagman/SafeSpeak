"use client";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { generateLegalPackPDF, downloadBlob } from "@/lib/legalPack";

export default function ReportView() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    const snap = await getDoc(doc(db, "reports", id)); setData(snap.data());
    const rSnap = await getDocs(collection(db, "ngos"));
    setResources(rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  })(); }, [id]);

  async function genPDF() {
    if (!data) return;
    const blob = await generateLegalPackPDF({
      reportId: id, createdAtISO: new Date().toISOString(),
      reporterSummary: data.summary || "", tags: data.tags || [], severity: data.severity || 3, urgency: data.urgency || "medium",
      sha256: data.fileSha256 || "", anchorTxHash: data.anchorTxHash || "", anchorExplorer: data.anchorExplorer || "https://sepolia.etherscan.io/tx/",
      resources: resources.slice(0, 6).map((r: any) => ({ name: r.name, contact: r.contact || "" }))
    });
    downloadBlob(blob, `SafeSpeak_LegalPack_${id}.pdf`);
  }

  async function shareSOS() {
    if (!data) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const message = `SOS from SafeSpeak: I may need help.\nReport ID: ${id}\nSummary: ${data.summary}\nOn-chain: ${(data.anchorExplorer || "https://sepolia.etherscan.io/tx/")}${data.anchorTxHash || ""}\nLink: ${url}`;
    if (navigator.share) { try { await navigator.share({ title: "SafeSpeak SOS", text: message, url }); } catch {} }
    else { prompt("Copy and send this message:", message); }
  }

  if (loading) return <main className="p-6">Loading...</main>;
  if (!data) return <main className="p-6">Not found</main>;

  return (
    <main className="max-w-xl mx-auto p-6 space-y-3">
      <h2 className="text-xl font-semibold">Report</h2>
      <div><span className="font-semibold">Summary:</span> {data.summary}</div>
      <div><span className="font-semibold">Tags:</span> {(data.tags || []).join(", ")}</div>
      <div><span className="font-semibold">Severity:</span> {data.severity}</div>
      {data.anchorTxHash && (
        <div>
          <span className="font-semibold">On-chain anchor: </span>
          <a className="text-blue-600 underline" target="_blank" href={`${data.anchorExplorer || "https://sepolia.etherscan.io/tx/"}${data.anchorTxHash}`}>View Transaction</a>
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <button onClick={genPDF} className="bg-slate-800 text-white px-3 py-2 rounded">Download Legal Pack</button>
        <button onClick={shareSOS} className="bg-red-600 text-white px-3 py-2 rounded">Send SOS</button>
      </div>
    </main>
  );
}