"use client";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Orb from "@/components/Orb";
=======
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useState } from "react";
>>>>>>> 2c21052ab1a3130dc3d471ecf5c35536dc9b1c56

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ur', name: 'اردو (Urdu)' },
];

export default function Settings() {
<<<<<<< HEAD
  const { t, i18n } = useTranslation('common');
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  // Toggle states
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [locationServices, setLocationServices] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  
  // Load saved preferences on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedNotifications = localStorage.getItem('notifications');
    const savedLocation = localStorage.getItem('locationServices');
    const savedStealthMode = localStorage.getItem('stealthMode');
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
    if (savedLocation !== null) setLocationServices(JSON.parse(savedLocation));
    if (savedStealthMode !== null) setStealthMode(JSON.parse(savedStealthMode));
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);
  
  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage);
  };
  
  // Stealth mode effect
  useEffect(() => {
    document.body.classList.toggle("stealth", stealthMode);
    document.title = stealthMode ? "Notes" : "SafeSpeak";
  }, [stealthMode]);
  
  // Save preferences to localStorage
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
  };
  
  const toggleNotifications = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notifications', JSON.stringify(newValue));
  };
  
  const toggleLocationServices = () => {
    const newValue = !locationServices;
    setLocationServices(newValue);
    localStorage.setItem('locationServices', JSON.stringify(newValue));
  };
  
  const toggleStealthMode = () => {
    const newValue = !stealthMode;
    setStealthMode(newValue);
    localStorage.setItem('stealthMode', JSON.stringify(newValue));
  };
=======
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  async function upgrade() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return alert("Enter a valid email address");
    setSending(true);
    try {
      const actionCodeSettings = { url: window.location.origin, handleCodeInApp: true };
      window.localStorage.setItem("emailForSignIn", email);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert("Magic link sent. Check your inbox.");
    } catch (e: any) { console.error(e); alert(e.message || "Error sending magic link"); }
    finally { setSending(false); }
  }
>>>>>>> 2c21052ab1a3130dc3d471ecf5c35536dc9b1c56
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="space-y-2">
        <label className="block text-sm">Language</label>
        <select className="border p-2 rounded" aria-label="Language">
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
<<<<<<< HEAD
      
      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto p-6 space-y-6">
        <div className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-4 py-2 backdrop-blur">
          <h2 className="font-semibold tracking-tight text-white">{t('settings')}</h2>
        </div>
        
        <div className="space-y-6">
          {/* Language Settings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">{t('language')}</label>
              <select 
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent focus:outline-none" 
                aria-label="Language"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-900">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Additional Settings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('preferences')}</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white/90">{t('remember_me')}</label>
                  <p className="text-xs text-white/60">{t('remember_me_desc')}</p>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 ${
                    darkMode ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white/90">{t('stealth_mode_setting')}</label>
                  <p className="text-xs text-white/60">{t('stealth_mode_desc')}</p>
                </div>
                <button 
                  onClick={toggleStealthMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 ${
                    stealthMode ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    stealthMode ? 'translate-x-6' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white/90">{t('notifications')}</label>
                  <p className="text-xs text-white/60">{t('notifications_desc')}</p>
                </div>
                <button 
                  onClick={toggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 ${
                    notifications ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white/90">{t('location_services')}</label>
                  <p className="text-xs text-white/60">{t('location_services_desc')}</p>
                </div>
                <button 
                  onClick={toggleLocationServices}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 ${
                    locationServices ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    locationServices ? 'translate-x-6' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur p-6 space-y-4">
            <h3 className="text-lg font-semibold text-red-400">{t('danger_zone')}</h3>
            <div className="space-y-2">
              <p className="text-sm text-white/70">{t('danger_zone_desc')}</p>
              <button className="rounded-full border border-red-500/20 bg-red-500/10 backdrop-blur px-4 py-2 font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                {t('delete_account')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
=======
      <div className="space-y-2">
        <label className="block text-sm">Upgrade account (magic link)</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 rounded w-full" placeholder="Email" type="email" />
        <button onClick={upgrade} disabled={sending} className="bg-slate-800 text-white px-3 py-2 rounded">
          {sending ? "Sending..." : "Send Magic Link"}
        </button>
      </div>
    </main>
>>>>>>> 2c21052ab1a3130dc3d471ecf5c35536dc9b1c56
  );
}