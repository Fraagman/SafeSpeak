"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Resources() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => {
    try { const snap = await getDocs(collection(db, "ngos"));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } finally { setLoading(false); }
  })(); }, []);
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-3">Nearby NGOs</h2>
      {loading && <div>Loading resources…</div>}
      {!loading && items.length === 0 && <div>No resources yet.</div>}
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="border rounded p-3 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{i.name}</h3>
              {i.verified && <span className="px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700">Verified</span>}
            </div>
            {i.services?.length ? <div className="text-sm text-slate-600">Services: {i.services.join(", ")}</div> : null}
            {i.languages?.length ? <div className="text-sm text-slate-600">Languages: {i.languages.join(", ")}</div> : null}
            {i.contact ? <div className="text-sm text-slate-600">Contact: {i.contact}</div> : null}
          </div>
        ))}
      </div>
    </main>
  );
}