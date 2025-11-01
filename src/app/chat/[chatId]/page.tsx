"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ensureAnon, auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where, getDocs, deleteDoc } from "firebase/firestore";
import { genKeypair, deriveSharedKey, encryptMessage, decryptMessage } from "@/lib/chatCrypto";

export default function ChatPage() {
  const { chatId } = useParams() as { chatId: string };
  const [sharedKey, setSharedKey] = useState<Uint8Array | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => { ensureAnon(); }, []);
  useEffect(() => { (async () => {
    const chatRef = doc(db, "chats", chatId); const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) return; const data = chatSnap.data() as any;
    let mySecret = localStorage.getItem(`chat:${chatId}:sk`);
    if (!mySecret) { const kp = genKeypair();
      localStorage.setItem(`chat:${chatId}:sk`, kp.secretKey);
      localStorage.setItem(`chat:${chatId}:pk`, kp.publicKey);
      mySecret = kp.secretKey; }
    const peerPub = data.ngoPublicKey || data.initiatorPublicKey; if (!peerPub) return;
    setSharedKey(deriveSharedKey(peerPub, mySecret));
    const msgsRef = collection(chatRef, "messages"); const q = query(msgsRef, orderBy("createdAt","asc"));
    const unsub = onSnapshot(q, snap => {
      const now = Date.now(); const arr: any[] = [];
      snap.forEach(d => { const m = { id: d.id, ...d.data() } as any;
        if (!m.expiresAt || m.expiresAt > now) arr.push(m); });
      setMessages(arr);
    });
    return () => unsub();
  })(); }, [chatId]);

  async function send() {
    if (!sharedKey || !text.trim()) return;
    const user = auth.currentUser!; const { ciphertext, nonce } = encryptMessage(sharedKey, text.trim());
    const chatRef = doc(db, "chats", chatId);
    await addDoc(collection(chatRef, "messages"), { senderUid: user.uid, ciphertext, nonce, createdAt: serverTimestamp(), expiresAt: Date.now() + 24*60*60*1000 });
    setText("");
  }
  async function purgeExpired() {
    const chatRef = doc(db, "chats", chatId); const msgsRef = collection(chatRef, "messages");
    const snap = await getDocs(query(msgsRef, where("expiresAt","<=", Date.now())));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
  }

  return (
    <main className="max-w-xl mx-auto p-4 space-y-3">
      <h2 className="text-xl font-semibold">Secure Chat</h2>
      <div className="border rounded p-3 h-96 overflow-auto bg-white">
        {messages.map(m => {
          const body = sharedKey ? decryptMessage(sharedKey, m.ciphertext, m.nonce) : "...";
          const mine = m.senderUid === auth.currentUser?.uid;
          return (
            <div key={m.id} className={`my-2 ${mine ? "text-right" : "text-left"}`}>
              <span className={`inline-block px-3 py-2 rounded ${mine ? "bg-emerald-100" : "bg-slate-100"}`}>{body}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border p-2" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." aria-label="Message input" />
        <button onClick={send} className="bg-emerald-600 text-white px-4 py-2 rounded" aria-label="Send message">Send</button>
        <button onClick={purgeExpired} className="bg-slate-200 px-3 rounded" title="Delete expired messages">Purge</button>
      </div>
    </main>
  );
}