import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ReactNode } from "react";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata = { title: "SafeSpeak", description: "Anonymous reporting and support" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="min-h-screen antialiased">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}