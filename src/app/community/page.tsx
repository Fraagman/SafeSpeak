"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ensureAnon, auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Prism from "@/components/Prism";

const globalChatId = "global-support-hub";

function getAnonymousName(uid: string): string {
  const key = `anonName:${uid}`;
  const cached = localStorage.getItem(key);
  if (cached) return cached;
  // Generate a soft, caring pseudonym
  const adjectives = [
    "Caring",
    "Brave",
    "Kind",
    "Gentle",
    "Hopeful",
    "Calm",
    "Bright",
    "Warm",
    "Quiet",
    "Patient",
  ];
  const nouns = [
    "Supporter",
    "Listener",
    "Friend",
    "Ally",
    "Helper",
    "Companion",
    "Neighbor",
    "Buddy",
    "Guardian",
    "Peer",
  ];
  const num = Math.floor(Math.random() * 89) + 11; // 11-99
  const name = `${
    adjectives[Math.floor(Math.random() * adjectives.length)]
  } ${nouns[Math.floor(Math.random() * nouns.length)]} #${num}`;
  localStorage.setItem(key, name);
  return name;
}

export default function CommunityPage() {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Array<{ id: string; senderAnonName: string; body: string; createdAt?: any }>>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [myAnonName, setMyAnonName] = useState<string>("");
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
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Function to randomize prism parameters
  const randomizePrism = () => {
    const animationTypes = ['rotate', 'hover', '3drotate'] as const;
    const newParams = {
      animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)],
      timeScale: Math.random() * 1.5 + 0.2, // 0.2 to 1.7
      height: Math.random() * 3 + 2, // 2 to 5
      baseWidth: Math.random() * 4 + 3, // 3 to 7
      scale: Math.random() * 3 + 2, // 2 to 5
      hueShift: Math.random() * 360, // 0 to 360
      colorFrequency: Math.random() * 2 + 0.5, // 0.5 to 2.5
      noise: Math.random() * 0.8, // 0 to 0.8
      glow: Math.random() * 1.5 + 0.5, // 0.5 to 2
      additionalPrisms: Math.floor(Math.random() * 3) // 0 to 2 additional prisms
    };
    setPrismParams(newParams);
    // Store in localStorage for persistence across navigation
    localStorage.setItem('prismParams', JSON.stringify(newParams));
  };

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

  // Ensure anonymous auth on mount
  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const user = await ensureAnon();
        if (user?.uid) {
          setMyAnonName(getAnonymousName(user.uid));
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(e?.message || t('failed_init_session'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Subscribe to global messages
  useEffect(() => {
    const chatRef = doc(db, "chats", globalChatId);
    const msgsRef = collection(chatRef, "messages");
    const q = query(msgsRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr: any[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setMessages(arr);
      // Auto-scroll to bottom
      requestAnimationFrame(() => {
        if (scrollerRef.current) {
          scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
        }
      });
    });
    return () => unsub();
  }, []);

  async function send() {
    const body = text.trim();
    if (!body) return;
    const user = auth.currentUser || (await ensureAnon());
    if (!user?.uid) return;

    const chatRef = doc(db, "chats", globalChatId);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: ["global-support-hub", "system"],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    const senderAnonName = getAnonymousName(user.uid);
    await addDoc(collection(chatRef, "messages"), {
      senderAnonName,
      body,
      createdAt: serverTimestamp(),
    });
    setText("");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        {t('loading_community')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="mb-3 text-red-600">{error}</div>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => location.reload()}>
          {t('retry')}
        </button>
      </div>
    );
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
          <h1 className="font-semibold tracking-tight text-white">Anonymous Community</h1>
          <span className="text-sm text-white/60">Global Room</span>
        </div>
        
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
          {/* Community Messages */}
          <div
            ref={scrollerRef}
            className="border border-white/10 rounded-xl p-4 h-[60vh] overflow-auto bg-black/20 backdrop-blur-sm"
            aria-label="Community message history"
          >
            {messages.length === 0 && (
              <div className="text-white/60 text-center py-8">No messages yet. Start the conversation!</div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4 p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-white/90">{msg.senderAnonName}</span>
                  <span className="text-xs text-white/50">
                    {msg.createdAt?.toDate?.()?.toLocaleString() || 'Just now'}
                  </span>
                </div>
                <div className="text-white/80">{msg.body}</div>
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-transparent focus:outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              aria-label="Message input"
            />
            <button
              onClick={send}
              className="rounded-full bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
          
          <p className="mt-3 text-xs text-white/50">
            Posts are completely anonymous. Your identity is protected.
          </p>
        </div>
        
        {/* Community Guidelines */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Community Guidelines</h3>
          <div className="space-y-3 text-white/70 text-sm">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
              <span>Be supportive and respectful to all community members</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-sky-400 flex-shrink-0"></span>
              <span>Share experiences and offer help when you can</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0"></span>
              <span>This is a safe space for sharing experiences and finding support</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0"></span>
              <span>Your identity is always protected - no personal data required</span>
            </div>
          </div>
        </div>
        
        {/* Your Anonymous Identity */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Anonymous Identity</h3>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-gradient-to-r from-emerald-500/20 to-sky-500/20 border border-white/10 p-4">
              <div className="text-2xl">👤</div>
            </div>
            <div>
              <div className="text-white/90 font-medium">{myAnonName}</div>
              <div className="text-white/60 text-sm">Your anonymous display name</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
