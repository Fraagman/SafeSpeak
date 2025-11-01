import "./globals.css";
import { ReactNode } from "react";
import EmailLinkAuthHandler from "@/components/EmailLinkAuthHandler";

export const metadata = { title: "SafeSpeak", description: "Anonymous reporting and support" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <EmailLinkAuthHandler />
        {children}
      </body>
    </html>
  );
}