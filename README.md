SafeSpeak — Secure Anonymous Reporting + Support Portal
Live Demo  ·  Presentation Slides  ·  Video Demo

A project by DeadPixel.

The Problem
PR25-14: Reporting and Support Portal Against Harassment

Many women face workplace or public harassment but hesitate to report it due to fear of retaliation, social stigma, or a lack of safe, confidential channels. Existing systems often feel bureaucratic, untrustworthy, or put the burden of proof on the victim, causing further trauma. This silence leaves perpetrators unaccountable and allows toxic environments to persist.

Our Solution
SafeSpeak is a secure, anonymous platform designed with a privacy-first, survivor-centric approach. It empowers users to report incidents of harassment, share their experiences, and access timely support without compromising their identity or safety.

Our solution is built on three pillars: Security, Support, and Integrity.

Security & Anonymity: Every report is protected with client-side, end-to-end encryption. Evidence is uploaded as encrypted ciphertext, and on-device face blurring and EXIF stripping ensure no personally identifiable information (PII) is unintentionally shared. Users are anonymous by default, with optional upgrades via magic-link.

AI-Powered Triage & Support: We use DeepSeek R1 to safely analyze redacted text, automatically categorizing reports by type, severity, and urgency. This allows us to instantly suggest localized, verified support resources (legal aid, counseling, shelters) and connect users with NGOs for confidential help.

Verifiable Integrity: To ensure every report is tamper-evident without exposing data, we publish a SHA-256 hash of the encrypted evidence to a public blockchain testnet (Ethereum Sepolia or Polygon Amoy). This creates an immutable, timestamped record that can be used for legal purposes, providing a "chain of custody" for digital evidence.

Key Features
Anonymous Reporting: No account needed to start. Users are anonymous by default.
End-to-End Encryption (E2EE): All report data is encrypted on the client device with AES-GCM before upload. The server only ever sees ciphertext.
On-Device Redaction: Face blurring and EXIF metadata stripping are performed in-browser using Canvas and TensorFlow.js. No raw media is ever uploaded.
AI-Powered Analysis: DeepSeek R1 analyzes redacted text to tag incidents (e.g., workplace, online, physical), assess severity, and provide a neutral summary for caseworkers.
Blockchain Anchoring: A SHA-256 hash of the encrypted evidence is anchored on a public testnet, creating a tamper-proof timestamp and integrity proof.
E2E Encrypted Chat: Users can connect with verified NGOs through a secure chat with disappearing messages, powered by tweetnacl.js.
Legal Pack Generator: A one-click "Download Legal Pack" feature creates a PDF with a timeline, report summary, evidence hash, and on-chain anchor link, ready for legal or HR use.
Safety-First UX:
Quick Exit Button: Instantly redirects to a neutral site and clears session data.
Stealth Mode: Disguises the UI to look like a generic notes app.
Manual SOS: A "Send SOS" button allows users to quickly share a pre-formatted message and a link to their report via Web Share, SMS, or email.
Technologies Used
This project was built with a focus on modern, free-tier-friendly, and secure technologies.

Frontend:

Next.js 14 (App Router): For a fast, server-rendered React application and API routes.
Tailwind CSS: For rapid, utility-first styling.
Framer Motion: For tasteful animations and page transitions.
Progressive Web App (PWA): For offline access and a native-like feel.
Backend & API:

Authentication: For anonymous and magic-link (email) user sessions.
Firestore: As our secure, real-time NoSQL database for metadata and E2E chat.
Cloud Storage: For storing encrypted evidence blobs.
AI & Machine Learning:

DeepSeek R1: For PII redaction and incident classification, accessed via a secure API route.
TensorFlow.js (BlazeFace): For on-device, in-browser face detection.
Security & Encryption:

Web Crypto API (AES-GCM): For client-side end-to-end encryption of all evidence.
tweetnacl.js: For end-to-end encryption in the support chat (X25519, secretbox).
ethers.js: To interact with blockchain testnets.
Ethereum Sepolia / Polygon Amoy: Public testnets for free, immutable hash anchoring.
Utilities:

pdf-lib: For generating the Legal Pack PDF entirely on the client side.
Canvas API: For image manipulation (blurring, EXIF stripping).
Lenis: For smooth scrolling.
Getting Started
Prerequisites
Node.js (v18+)
Firebase CLI (npm i -g firebase-tools)
A Firebase project (Spark plan) with Auth, Firestore, and Storage enabled.
A Vercel account linked to your GitHub repo.
Setup & Installation
Clone the repository:

Bash

git clone https://github.com/your-username/safespeak.git
cd safespeak
Install dependencies:

Bash

npm install
Environment Variables:

Create a .env.local file in the root and add your client-side Firebase credentials. See .env.local.example.
Set up your server-side environment variables on Vercel (Project -> Settings -> Environment Variables). You will need:
FIREBASE_SERVICE_ACCOUNT (the full JSON from your Firebase service account key)
DEEPSEEK_API_KEY
SEPOLIA_RPC_URL (or your RPC provider URL)
SEPOLIA_PRIVATE_KEY (a private key for a testnet wallet with faucet ETH)
Run the development server:

Bash

npm run dev
Open http://localhost:3000 to view the app.

Deploy
The project is configured for one-click deployment on Vercel. Simply push to the main branch connected to your Vercel project.

Team DeadPixel
