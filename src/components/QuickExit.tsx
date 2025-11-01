"use client";
export default function QuickExit() {
  const neutral = process.env.NEXT_PUBLIC_APP_STEALTH_NEUTRAL_URL || "https://www.bbc.com/news";
  return (
    <button
      onClick={() => {
        try { localStorage.clear(); sessionStorage.clear(); } catch {}
        window.location.href = neutral;
      }}
      className="fixed right-3 top-3 z-50 rounded bg-red-600 px-3 py-2 text-white"
      aria-label="Quick exit"
    >
      Exit
    </button>
  );
}