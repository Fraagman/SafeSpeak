"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ensureAnon, auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where, getDocs, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { genKeypair, deriveSharedKey, encryptMessage, decryptMessage } from "@/lib/chatCrypto";
import Prism from "@/components/Prism";

export default function ChatPage() {
  const { chatId } = useParams() as { chatId: string };
  const router = useRouter();
  const [sharedKey, setSharedKey] = useState<Uint8Array | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [prismParams, setPrismParams] = useState({
    animationType: 'rotate' as const,
    timeScale: 0.5,
    height: 3.5,
    baseWidth: 5.5,
    scale: 3.6,
    hueShift: 0,
    colorFrequency: 1,
    noise: 0.5,
    glow: 1,
    additionalPrisms: 0
  });

  useEffect(() => { ensureAnon(); }, []);
  
  // Load prism parameters from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('prismParams');
    if (stored) {
      try {
        const params = JSON.parse(stored);
        setPrismParams(params);
      } catch (e) {
        // If parsing fails, keep default parameters
      }
    }
  }, []);
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

  async function handleLeaveChat() {
    await ensureAnon();
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, { participants: arrayRemove(uid) });
    router.push("/chat");
  }

  return (
    <div className="relative min-h-screen">
      {/* Prism Background */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Main Prism */}
        <Prism
          animationType={prismParams.animationType}
          timeScale={prismParams.timeScale}
          height={prismParams.height}
          baseWidth={prismParams.baseWidth}
          scale={prismParams.scale}
          hueShift={prismParams.hueShift}
          colorFrequency={prismParams.colorFrequency}
          noise={prismParams.noise}
          glow={prismParams.glow}
        />
        
        {/* Additional Prisms */}
        {prismParams.additionalPrisms > 0 && (
          <div className="absolute inset-0 opacity-60">
            <Prism
              animationType="hover"
              timeScale={prismParams.timeScale * 0.7}
              height={prismParams.height * 0.8}
              baseWidth={prismParams.baseWidth * 0.8}
              scale={prismParams.scale * 1.2}
              hueShift={prismParams.hueShift + 120}
              colorFrequency={prismParams.colorFrequency * 1.3}
              noise={prismParams.noise * 0.5}
              glow={prismParams.glow * 0.8}
            />
          </div>
        )}
        
        {prismParams.additionalPrisms > 1 && (
          <div className="absolute inset-0 opacity-40">
            <Prism
              animationType="3drotate"
              timeScale={prismParams.timeScale * 1.3}
              height={prismParams.height * 1.2}
              baseWidth={prismParams.baseWidth * 1.1}
              scale={prismParams.scale * 0.8}
              hueShift={prismParams.hueShift + 240}
              colorFrequency={prismParams.colorFrequency * 0.7}
              noise={prismParams.noise * 1.2}
              glow={prismParams.glow * 1.2}
            />
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-4 py-2 backdrop-blur max-w-fit">
          <h1 className="font-semibold tracking-tight text-white">Secure Chat</h1>
          <button
            className="rounded-full border border-red-500/20 bg-red-500/10 backdrop-blur px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            onClick={() => {
              const ok = window.confirm(
                "Are you sure you want to delete this chat? This will only remove it from your list, but counselors may still see the record."
              );
              if (ok) {
                void handleLeaveChat();
              }
            }}
          >
            Delete Chat
          </button>
        </div>
        
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          {/* Chat Messages */}
          <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur p-4 h-96 overflow-auto">
            {messages.map(m => {
              const body = sharedKey ? decryptMessage(sharedKey, m.ciphertext, m.nonce) : "...";
              const mine = m.senderUid === auth.currentUser?.uid;
              return (
                <div key={m.id} className={`my-2 ${mine ? "text-right" : "text-left"}`}>
                  <span className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                    mine 
                      ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/30" 
                      : "bg-white/10 text-white/80 border border-white/20"
                  }`}>
                    {body}
                  </span>
                </div>
              );
            })}
            {messages.length === 0 && (
              <div className="text-center text-white/50 py-8">
                No messages yet. Start the conversation...
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="mt-4 flex gap-3">
            <input 
              className="flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30" 
              value={text} 
              onChange={e=>setText(e.target.value)} 
              placeholder="Type a message..." 
              aria-label="Message input"
              onKeyPress={(e) => e.key === 'Enter' && send()}
            />
            <button 
              onClick={send} 
              className="rounded-full bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors" 
              aria-label="Send message"
            >
              Send
            </button>
            <button 
              onClick={purgeExpired} 
              className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-3 text-sm font-medium text-white hover:bg-white/20 transition-colors" 
              title="Delete expired messages"
            >
              Purge
            </button>
          </div>
        </div>
        
        {/* Chat Info */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Chat Information</h3>
          <div className="space-y-3 text-white/70 text-sm">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
              <span>Messages are end-to-end encrypted and automatically expire after 24 hours</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-sky-400 flex-shrink-0"></span>
              <span>Chat ID: <span className="font-mono text-white/90">{chatId}</span></span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0"></span>
              <span>Your identity is protected - only the chat content is visible</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}