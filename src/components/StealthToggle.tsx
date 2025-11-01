"use client";
import { useEffect, useState } from "react";
export default function StealthToggle() {
  const [stealth, setStealth] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("stealth", stealth);
    document.title = stealth ? "Notes" : "SafeSpeak";
  }, [stealth]);
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input 
          type="checkbox" 
          checked={stealth} 
          onChange={(e)=>setStealth(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${
          stealth ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-white/20'
        }`}>
          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
            stealth ? 'translate-x-7' : 'translate-x-0'
          }`}></div>
        </div>
      </div>
      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
        Stealth mode
      </span>
    </label>
  );
}