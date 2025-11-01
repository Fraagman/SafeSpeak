"use client";
import { ReactNode } from "react";
import EmailLinkAuthHandler from "@/components/EmailLinkAuthHandler";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
<<<<<<< HEAD
import "@/lib/i18n";
=======
import { GlobalWaveBackground } from "@/components/GlobalWaveBackground";
>>>>>>> 2c21052ab1a3130dc3d471ecf5c35536dc9b1c56

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

