"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Array<{ id: string; senderAnonName: string; body: string; createdAt?: any }>>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Ensure anonymous auth on mount
  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        await ensureAnon();
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(e?.message || "Failed to initialize anonymous session");
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
        Loading community...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="mb-3 text-red-600">{error}</div>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Anonymous Community</h1>
        <span className="text-sm text-gray-500">Global Room</span>
      </div>

      <div
        ref={scrollerRef}
        className="border rounded p-3 h-[60vh] overflow-auto bg-white"
        aria-label="Community message history"
      >
        {messages.length === 0 && (
          <div className="text-gray-500">No messages yet. Say hello to the community!</div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="my-2">
            <div className="text-sm text-gray-700 font-medium">{m.senderAnonName}</div>
            <div className="inline-block bg-slate-100 rounded px-3 py-2 mt-0.5 max-w-full break-words">
              {m.body}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts…"
          aria-label="Message input"
        />
        <button
          onClick={send}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          aria-label="Send message"
        >
          Send
        </button>
      </div>

      <p className="text-xs text-gray-500">
        You are posting with an anonymous display name. Please avoid sharing any personal identifying information.
      </p>
    </main>
  );
}
