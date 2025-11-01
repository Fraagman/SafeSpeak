"use client";
export default function QuickExit() {
  const neutral = process.env.NEXT_PUBLIC_APP_STEALTH_NEUTRAL_URL || "https://www.bbc.com/news";
  return (
    <button
      onClick={() => {
        try { localStorage.clear(); sessionStorage.clear(); } catch {}
        window.location.href = neutral;
      }}
      className="fixed left-6 top-24 z-50 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-white/10"
      aria-label="Quick exit"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      Quick Exit
    </button>
  );
}