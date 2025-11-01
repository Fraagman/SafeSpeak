"use client";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useState } from "react";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  async function upgrade() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return alert("Enter a valid email address");
    setSending(true);
    try {
      const actionCodeSettings = { url: window.location.origin, handleCodeInApp: true };
      window.localStorage.setItem("emailForSignIn", email);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert("Magic link sent. Check your inbox.");
    } catch (e: any) { console.error(e); alert(e.message || "Error sending magic link"); }
    finally { setSending(false); }
  }
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="space-y-2">
        <label className="block text-sm">Language</label>
        <select className="border p-2 rounded" aria-label="Language">
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Upgrade account (magic link)</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 rounded w-full" placeholder="Email" type="email" />
        <button onClick={upgrade} disabled={sending} className="bg-slate-800 text-white px-3 py-2 rounded">
          {sending ? "Sending..." : "Send Magic Link"}
        </button>
      </div>
    </main>
  );
}