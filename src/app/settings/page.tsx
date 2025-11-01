"use client";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useState, useEffect } from "react";
import Orb from "@/components/Orb";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  
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
    
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
    if (savedLocation !== null) setLocationServices(JSON.parse(savedLocation));
    if (savedStealthMode !== null) setStealthMode(JSON.parse(savedStealthMode));
  }, []);
  
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
        
        {/* Fourth Orb - Top Right */}
        <div style={{ 
          width: '50%', 
          height: '50vh', 
          position: 'absolute', 
          right: '-10%', 
          top: '-10%',
          pointerEvents: 'none'
        }}>
          <Orb
            hoverIntensity={0}
            rotateOnHover={false}
            hue={0}
            forceHoverState={true}
          />
        </div>
        
        {/* Fifth Orb - Bottom Left */}
        <div style={{ 
          width: '70%', 
          height: '70vh', 
          position: 'absolute', 
          left: '-20%', 
          bottom: '-20%',
          pointerEvents: 'none'
        }}>
          <Orb
            hoverIntensity={0}
            rotateOnHover={false}
            hue={60}
            forceHoverState={true}
          />
        </div>
        
        {/* Sixth Orb - Center Right */}
        <div style={{ 
          width: '40%', 
          height: '40vh', 
          position: 'absolute', 
          right: '5%', 
          top: '30%',
          pointerEvents: 'none'
        }}>
          <Orb
            hoverIntensity={0}
            rotateOnHover={false}
            hue={300}
            forceHoverState={true}
          />
        </div>
        
        {/* Seventh Orb - Center Left */}
        <div style={{ 
          width: '45%', 
          height: '45vh', 
          position: 'absolute', 
          left: '5%', 
          top: '25%',
          pointerEvents: 'none'
        }}>
          <Orb
            hoverIntensity={0}
            rotateOnHover={false}
            hue={180}
            forceHoverState={true}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto p-6 space-y-6">
        <div className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-4 py-2 backdrop-blur">
          <h2 className="font-semibold tracking-tight text-white">Settings</h2>
        </div>
        
        <div className="space-y-6">
          {/* Language Settings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Language</label>
              <select 
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent focus:outline-none" 
                aria-label="Language"
              >
                <option value="en" className="bg-gray-900">English</option>
                <option value="hi" className="bg-gray-900">Hindi</option>
              </select>
            </div>
          </div>
          
          {/* Account Upgrade */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Upgrade account (magic link)</label>
              <input 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-transparent focus:outline-none" 
                placeholder="Enter your email address" 
                type="email" 
                disabled={sending}
              />
            </div>
            <button 
              onClick={upgrade} 
              disabled={sending} 
              className={`rounded-full px-6 py-3 font-medium transition-colors ${
                sending 
                  ? 'bg-white/10 border border-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {sending ? "Sending..." : "Send Magic Link"}
            </button>
          </div>
          
          {/* Additional Settings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white/90">Remember Me</label>
                  <p className="text-xs text-white/60">Keep me logged in for faster access</p>
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
                  <label className="text-sm font-medium text-white/90">Stealth Mode</label>
                  <p className="text-xs text-white/60">Hide app appearance for privacy</p>
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
                  <label className="text-sm font-medium text-white/90">Notifications</label>
                  <p className="text-xs text-white/60">Receive email notifications for updates</p>
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
                  <label className="text-sm font-medium text-white/90">Location Services</label>
                  <p className="text-xs text-white/60">Allow access to your location for nearby resources</p>
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
            <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            <div className="space-y-2">
              <p className="text-sm text-white/70">These actions cannot be undone.</p>
              <button className="rounded-full border border-red-500/20 bg-red-500/10 backdrop-blur px-4 py-2 font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}