"use client";
import { ReactNode } from "react";
import EmailLinkAuthHandler from "@/components/EmailLinkAuthHandler";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import { GlobalWaveBackground } from "@/components/GlobalWaveBackground";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <GlobalWaveBackground />
      <SmoothScroll />
      <EmailLinkAuthHandler />
      <Nav />
      <main className="pt-28 relative z-10">
        {children}
      </main>
    </>
  );
}

