"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import QuickExit from "./QuickExit";
import StealthToggle from "./StealthToggle";

export default function Nav() {
  const { t } = useTranslation('common');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage first
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      localStorage.setItem('isLoggedIn', user ? 'true' : 'false');
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.setItem('isLoggedIn', 'false');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-4 py-2 backdrop-blur">
          <Link href="/" className="font-semibold tracking-tight text-white">{t('safespeak')}</Link>
          <nav className="flex items-center gap-4 text-sm text-white/70">
            <Link href="/resources" className="hover:text-white transition-colors">{t('resources')}</Link>
            <Link href="/about" className="hover:text-white transition-colors">{t('about')}</Link>
            <Link href="/report/new" className="hover:text-white transition-colors">{t('report')}</Link>
            <Link href="/settings" className="hover:text-white transition-colors">{t('settings')}</Link>
            <Link href="/chat" className="rounded-full bg-white text-black px-3 py-1.5 hover:bg-white/90 transition">
              {t('get_support')}
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-1.5 hover:bg-red-500/30 transition"
              >
                {t('logout')}
              </button>
            ) : (
              <Link href="/login" className="rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 hover:bg-emerald-500/30 transition">
                {t('login').toUpperCase()}
              </Link>
            )}
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

