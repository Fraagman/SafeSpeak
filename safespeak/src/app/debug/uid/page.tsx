"use client";

import { useEffect, useState } from "react";

import { auth, ensureAnon } from "@/lib/firebase";

type CopyState = "idle" | "copied";

export default function DebugUidPage() {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await ensureAnon();
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const user = auth.currentUser;

  const handleCopy = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      return;
    }

    try {
      await navigator.clipboard.writeText(uid);
      setCopyState("copied");
      setTimeout(() => {
        setCopyState("idle");
      }, 1500);
    } catch (error) {
      console.error("Clipboard copy failed:", error instanceof Error ? error.message : error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Your UID</h1>
      {!ready || !user ? (
        <p className="text-gray-600">Signing in anonymously…</p>
      ) : (
        <div className="flex w-full max-w-md flex-col gap-3">
          <input
            className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-800"
            value={user.uid}
            readOnly
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Copy
            </button>
            {copyState === "copied" && <span className="text-sm text-green-600">Copied!</span>}
          </div>
        </div>
      )}
    </div>
  );
}
