"use client";
import { useEffect, useState } from "react";
export default function StealthToggle() {
  const [stealth, setStealth] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("stealth", stealth);
    document.title = stealth ? "Notes" : "SafeSpeak";
  }, [stealth]);
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={stealth} onChange={(e)=>setStealth(e.target.checked)} />
      <span>Stealth mode</span>
    </label>
  );
}