"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import TiltCard from "@/components/TiltCard";
import { Parallax } from "@/components/Parallax";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero Section */}
      <section className="relative py-24 min-h-[80vh] flex items-center overflow-hidden">
        {/* Content */}
        <div className="relative z-10 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: "easeOut" }}
            className="max-w-4xl text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight"
          >
            <span className="grad-text">Report safely.</span> Get support fast. Stay in control.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .15, duration: .7 }}
            className="mt-6 max-w-2xl text-lg text-white/80"
          >
            Anonymous reporting with client‑side encryption, AI triage, and verified resources — built with privacy first.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .25, duration: .7 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/report/new" className="group relative inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-black hover:bg-white/90 transition">
              Create report
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-white/90 hover:bg-white/10 transition">
              Browse resources
            </Link>
          </motion.div>
        </div>

        {/* Parallax accents */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Parallax offset={40}>
            <div className="absolute -top-10 right-10 h-28 w-28 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/20 blur-2xl animate-float" />
          </Parallax>
          <Parallax offset={30}>
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-400/20 to-cyan-400/20 blur-2xl animate-float" />
          </Parallax>
        </div>
      </section>

      {/* Logos / Marquee */}
      <section className="py-8 opacity-90">
        <Marquee>
          <span className="mx-8 text-white/70">Confidential</span>
          <span className="mx-8 text-white/70">Encrypted</span>
          <span className="mx-8 text-white/70">NGO‑Verified</span>
          <span className="mx-8 text-white/70">Open‑source</span>
        </Marquee>
      </section>

      {/* Features */}
      <section className="grid gap-6 py-16 md:grid-cols-3">
        <Reveal>
          <TiltCard>
            <h3 className="text-xl font-semibold text-white">Client‑side encryption</h3>
            <p className="mt-2 text-white/70">Your evidence never leaves your device unencrypted.</p>
          </TiltCard>
        </Reveal>
        <Reveal delay={.1}>
          <TiltCard>
            <h3 className="text-xl font-semibold text-white">Face blur + EXIF strip</h3>
            <p className="mt-2 text-white/70">Protect identities with on‑device redaction.</p>
          </TiltCard>
        </Reveal>
        <Reveal delay={.2}>
          <TiltCard>
            <h3 className="text-xl font-semibold text-white">AI triage</h3>
            <p className="mt-2 text-white/70">Categorize and route to local help quickly.</p>
          </TiltCard>
        </Reveal>
      </section>

      {/* Additional Features Section */}
      <section className="grid gap-6 py-16 md:grid-cols-3">
        <Reveal delay={.3}>
          <TiltCard>
            <h3 className="text-xl font-semibold text-white">Anonymous reporting</h3>
            <p className="mt-2 text-white/70">Share your story without revealing your identity.</p>
          </TiltCard>
        </Reveal>
        <Reveal delay={.4}>
          <TiltCard>
            <h3 className="text-xl font-semibold text-white">Verified resources</h3>
            <p className="mt-2 text-white/70">Connect with trusted local support organizations.</p>
          </TiltCard>
        </Reveal>
        <Reveal delay={.5}>
          <TiltCard>
            <h3 className="text-xl font-semibold text-white">Stealth mode</h3>
            <p className="mt-2 text-white/70">Quick exit and stealth features for your safety.</p>
          </TiltCard>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative my-20 rounded-3xl border border-white/10 backdrop-blur-sm p-10 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">No account required. You control what to share.</p>
          <div className="mt-6">
            <Link href="/report/new" className="rounded-full bg-white px-5 py-2.5 text-black hover:bg-white/90 transition">
              Start a report
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
