"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import Orb from "@/components/Orb";

export default function LoginPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if running on localhost
  const isLocalhost = 
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname === '0.0.0.0');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError(t('invalid_email'));
      return;
    }

    setSending(true);
    setError(null);
    try {
      // Construct the continue URL - Firebase requires authorized domains
      // IMPORTANT: Domain must be authorized in Firebase Console
      // Go to: Firebase Console → Authentication → Settings → Authorized domains
      const origin = window.location.origin;
      const continueUrl = isLocalhost 
        ? 'http://localhost:3000'  // Make sure this is added to authorized domains in Firebase
        : origin.replace(/\/$/, '');
      
      window.localStorage.setItem("emailForSignIn", email);
      
      // Action code settings - Firebase requires domain to be authorized
      const actionCodeSettings = {
        url: continueUrl,
        handleCodeInApp: true
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      setSuccess(true);
      // Set logged in state in localStorage for navigation
      localStorage.setItem('isLoggedIn', 'true');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (e: any) {
      console.error('Login error:', e);
      
      // Handle specific Firebase errors with helpful messages
      if (e.code === 'auth/quota-exceeded') {
        setError('We\'ve hit our daily limit for sending sign-in links. Please try again tomorrow or use a different sign-in method.');
      } else if (e.code === 'auth/unauthorized-continue-uri') {
        const errorMsg = isLocalhost 
          ? `${t('domain_not_configured')} ${t('localhost_tip')} ${t('firebase_config_steps')}`
          : `${t('domain_not_configured')} ${t('firebase_config_steps')}`;
        setError(errorMsg);
      } else if (e.code === 'auth/argument-error') {
        // Invalid actionCodeSettings format
        setError(t('invalid_config_error') + ' ' + t('firebase_config_steps'));
      } else if (e.code === 'auth/invalid-email') {
        setError(t('invalid_email'));
      } else if (e.code === 'auth/network-request-failed') {
        setError(t('network_error'));
      } else if (e.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later or reset your password.');
      } else {
        setError(e.message || t('error_sending_link'));
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Orb Background */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Main Orb - Center/Large */}
        <div style={{ width: '150%', height: '150vh', position: 'relative', left: '-25%', top: '-25%' }}>
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={200}
            forceHoverState={false}
          />
        </div>
        
        {/* Second Orb - Bottom Right */}
        <div style={{ 
          width: '80%', 
          height: '80vh', 
          position: 'absolute', 
          right: '-20%', 
          bottom: '-20%',
          pointerEvents: 'none'
        }}>
          <Orb
            hoverIntensity={0}
            rotateOnHover={false}
            hue={280}
            forceHoverState={true}
          />
        </div>
        
        {/* Third Orb - Top Left */}
        <div style={{ 
          width: '60%', 
          height: '60vh', 
          position: 'absolute', 
          left: '-15%', 
          top: '-15%',
          pointerEvents: 'none'
        }}>
          <Orb
            hoverIntensity={0}
            rotateOnHover={false}
            hue={120}
            forceHoverState={true}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">{t('login')}</h1>
              <p className="text-white/70">{t('login_description')}</p>
            </div>

            {success ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur p-6 text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-emerald-400 mb-2">{t('check_email')}</h2>
                <p className="text-white/80 mb-4">{t('magic_link_sent')}</p>
                <p className="text-sm text-white/60">{t('redirecting')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-white/90">
                    {t('email_address')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-transparent focus:outline-none"
                    placeholder={t('enter_email')}
                    required
                    disabled={sending}
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur p-4">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full rounded-full px-6 py-3 font-medium transition-colors ${
                    sending
                      ? 'bg-white/10 border border-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {sending ? t('sending') : t('send_magic_link')}
                </button>
              </form>
            )}

            <div className="text-center">
              <p className="text-sm text-white/60">
                {t('login_footer')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

