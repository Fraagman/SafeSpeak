"use client";
import { ReactNode } from "react";
import EmailLinkAuthHandler from "@/components/EmailLinkAuthHandler";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <EmailLinkAuthHandler />
      <Nav />
      <main className="pt-28 relative z-10">
        {children}
      </main>
    </>
  );
}

