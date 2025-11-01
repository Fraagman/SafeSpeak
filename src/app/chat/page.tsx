"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chatIds, setChatIds] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const db = useMemo(() => getFirestore(), []);

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
        setError(e?.message || "Failed to load chats");
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
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser || (await ensureAnon());
      if (!user?.uid) throw new Error("No user available");
      const newId = await createNewChat(db, user.uid);
      router.replace(`/chat/${newId}`);
    } catch (e: any) {
      setError(e?.message || "Failed to start a new chat");
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
      alert("Failed to remove chat. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        Loading chats...
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
          Retry
        </button>
      </div>
    );
  }

  // If we have chatIds, render a simple list with actions
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Your Chats</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded bg-green-600 text-white"
            onClick={handleStartNewChat}
            title="Create a private, personal chat"
          >
            Start New Chat
          </button>
          <button
            className="px-3 py-2 rounded bg-indigo-600 text-white"
            onClick={() => router.push('/community')}
            title="Join the anonymous community forum"
          >
            Join Anonymous Community
          </button>
        </div>
      </div>

      {Array.isArray(chatIds) && chatIds.length > 0 ? (
        <ul className="space-y-2">
          {chatIds.map((id) => (
            <li key={id} className="flex items-center justify-between p-3 border rounded gap-2">
              <div className="truncate">Chat {id}</div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded bg-blue-600 text-white"
                  onClick={() => router.replace(`/chat/${id}`)}
                >
                  Open
                </button>
                <button
                  className="px-3 py-1.5 rounded bg-red-600 text-white"
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
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-600">No chats found.</div>
      )}
    </div>
  );
}
