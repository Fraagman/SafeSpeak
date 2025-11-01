"use client";
import Link from "next/link";
import QuickExit from "./QuickExit";
import StealthToggle from "./StealthToggle";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-4 py-2 backdrop-blur">
          <Link href="/" className="font-semibold tracking-tight text-white">SafeSpeak</Link>
          <nav className="flex items-center gap-4 text-sm text-white/70">
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <Link href="/report/new" className="hover:text-white transition-colors">Report</Link>
            <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
            <Link href="/chat" className="rounded-full bg-white text-black px-3 py-1.5 hover:bg-white/90 transition">
              Get Support
            </Link>
          </nav>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-30">
        <div className="backdrop-blur rounded-full shadow-xl p-4 border border-white/10">
          <StealthToggle />
        </div>
      </div>
      <QuickExit />
    </header>
  );
}

