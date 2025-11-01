"use client";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    try {
      // Dynamic import to avoid SSR issues
      import("lenis").then((LenisModule) => {
        const Lenis = LenisModule.default;
        const lenis = new Lenis({ 
          duration: 1.1, 
          smoothWheel: true, 
          smoothTouch: false 
        });
        
        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        
        requestAnimationFrame(raf);
        
        return () => {
          lenis.destroy();
        };
      }).catch((err) => {
        console.warn("Failed to load Lenis:", err);
      });
    } catch (err) {
      console.warn("SmoothScroll error:", err);
    }
  }, []);
  return null;
}

