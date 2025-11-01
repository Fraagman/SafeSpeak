"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Prism from "@/components/Prism";
import { useTranslation } from "react-i18next";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Firestore,
  doc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";

// Ensure an anonymous user is signed in and return the current user.
async function ensureAnon(): Promise<User> {
  const auth = getAuth();
  // If already signed in, return immediately
  if (auth.currentUser) return auth.currentUser;

  // Wait for initial auth state; if still no user, sign in anonymously
  const user = await new Promise<User>(async (resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (u) => {
        if (u) {
          unsubscribe();
          resolve(u);
        }
      },
      (err) => {
        unsubscribe();
        reject(err);
      }
    );

    try {
      await signInAnonymously(auth);
    } catch (e) {
      // If sign-in fails but an auth state comes in, it will resolve via onAuthStateChanged
      // Otherwise, reject here
      // eslint-disable-next-line no-console
      console.error("Anonymous sign-in failed:", e);
    }
  });

  return user;
}

async function fetchUserChats(db: Firestore, uid: string): Promise<string[]> {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.id);
}

async function createNewChat(db: Firestore, uid: string): Promise<string> {
  const docRef = await addDoc(collection(db, "chats"), {
    participants: [uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export default function ChatIndexPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chatIds, setChatIds] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const db = useMemo(() => getFirestore(), []);

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

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setLoading(true);
        const user = await ensureAnon();
        if (!user?.uid) throw new Error("No user available after ensureAnon()");

        const ids = await fetchUserChats(db, user.uid);
        if (cancelled) return;

        if (!ids.length) {
          // No active chats, create one and redirect
          const newId = await createNewChat(db, user.uid);
          if (cancelled) return;
          router.replace(`/chat/${newId}`);
          return;
        }

        // Have chats: show list
        setChatIds(ids);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(e?.message || t('failed_load_chats'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [db, router]);

  async function handleStartNewChat() {
    try {
      randomizePrism(); // Randomize background before navigation
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser || (await ensureAnon());
      if (!user?.uid) throw new Error("No user available");
      const newId = await createNewChat(db, user.uid);
      router.replace(`/chat/${newId}`);
    } catch (e: any) {
      setError(e?.message || t('failed_start_chat'));
    } finally {
      setLoading(false);
    }
  }

  async function handleLeaveChat(chatId: string) {
    try {
      const auth = getAuth();
      const user = auth.currentUser || (await ensureAnon());
      if (!user?.uid) throw new Error("No user available");
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, { participants: arrayRemove(user.uid) });
      // Optimistically remove from local state immediately
      setChatIds((prev) => (Array.isArray(prev) ? prev.filter((id) => id !== chatId) : prev));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      alert(t('failed_remove_chat'));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        {t('loading_chats')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="mb-4 text-red-600 font-medium">{error}</div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => location.reload()}
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  // If we have chatIds, render a simple list with actions
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
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-4 py-2 backdrop-blur max-w-fit">
          <h1 className="font-semibold tracking-tight text-white">Get Support</h1>
        </div>
        
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Your Chats</h2>
            <div className="flex items-center gap-3">
              <button
                className="rounded-full bg-white text-black px-4 py-2 font-medium hover:bg-white/90 transition-colors"
                onClick={handleStartNewChat}
                title="Create a private, personal chat"
              >
                Start New Chat
              </button>
              <button
                className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-2 font-medium text-white hover:bg-white/20 transition-colors"
                onClick={() => {
                  randomizePrism(); // Randomize background before navigation
                  router.push('/community');
                }}
                title="Join the anonymous community forum"
              >
                Join Anonymous Community
              </button>
            </div>
          </div>

          {Array.isArray(chatIds) && chatIds.length > 0 ? (
            <div className="space-y-3">
              {chatIds.map((id) => (
                <div key={id} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition-all duration-300">
                  <div className="truncate text-white/80 font-mono">Chat {id}</div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                      onClick={() => router.replace(`/chat/${id}`)}
                    >
                      Open
                    </button>
                    <button
                      className="rounded-full border border-red-500/20 bg-red-500/10 backdrop-blur px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                      onClick={async () => {
                        const ok = window.confirm(
                          "Are you sure you want to remove this chat from your list? You can only join it again if you know the ID."
                        );
                        if (ok) await handleLeaveChat(id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-white/60 mb-4">No chats found.</div>
              <button
                className="rounded-full bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors"
                onClick={handleStartNewChat}
              >
                Start Your First Chat
              </button>
            </div>
          )}
        </div>
        
        {/* Help Section */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
          <div className="space-y-3 text-white/70 text-sm">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
              <span>Create private, encrypted chats with complete anonymity</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-sky-400 flex-shrink-0"></span>
              <span>Join community discussions for peer support and resources</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400 flex-shrink-0"></span>
              <span>Your identity is always protected - no personal data required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
