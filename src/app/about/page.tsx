"use client";
import LightRays from "@/components/LightRays";

export default function AboutPage() {
  const team = [
    {
      name: "SAKSHAM WADHANKAR",
      role: "Backend Engineer / Distributed Systems",
      blurb: "Implemented high-availability ingestion with tamper-evident storage.",
    },
    {
      name: "OM RAI",
      role: "Lead Developer / Blockchain Integration",
      blurb: "Architected the E2E encryption framework and on-chain integrity proofs.",
    },
    {
      name: "PADMAJA THAKRE",
      role: "Security Engineer / Privacy Systems",
      blurb: "Designed PII redaction pipelines and face-blurring safety tooling.",
    },
    
  ];

  return (
    <div className="relative min-h-screen">
      {/* LightRays Background */}
      <div className="fixed inset-0 z-0 bg-black">
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-4 py-2 backdrop-blur max-w-fit">
              <h1 className="font-semibold tracking-tight text-white">About SafeSpeak</h1>
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">
                Empowering Voices, Ensuring Evidence
              </h2>
              <p className="text-white/80 leading-7">
                In moments when reporting sensitive incidents matters most, survivors and
                witnesses face a critical gap: staying safe while preserving credible, court-admissible
                evidence. Conventional channels expose identities, leak context, and leave records
                vulnerable to tampering. SafeSpeak closes this security and evidence gap by enabling
                secure, private, and evidential reporting—so people can document, protect, and share
                what happened on their terms. With a privacy-first design and forensic integrity at its
                core, SafeSpeak safeguards identities while guaranteeing that the record remains
                verifiable and intact.
              </p>
            </div>
          </div>
        </section>

        {/* Core Technology Section */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Core Technology & Innovation</h2>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  <span className="leading-7"><strong className="text-white">End-to-End Encryption (E2E)</strong> — Data remains encrypted from capture to verification, ensuring only intended parties can decrypt.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400"></span>
                  <span className="leading-7"><strong className="text-white">Blockchain Proof of Integrity</strong> — Cryptographic proofs anchor evidence immutably, enabling independent verification of tamper-resistance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-fuchsia-400"></span>
                  <span className="leading-7"><strong className="text-white">PII Redaction and Face Blurring</strong> — Automated pipelines protect identities while preserving evidential value.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                  <span className="leading-7"><strong className="text-white">Stealth & Quick Exit Safety Features</strong> — Discreet UI patterns and instant safe-exit flows reduce exposure during high-risk use.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="flex items-baseline justify-between gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-white">
                  The Team Behind the Mission - DeadPixel
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                  <div
                    key={member.name}
                    className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                      <span className="text-xs text-white/60 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
                        DeadPixel
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-emerald-400 font-medium">{member.role}</p>
                    <p className="mt-3 text-white/70 leading-6">{member.blurb}</p>
                    <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="mt-5 flex items-center gap-2 text-xs text-white/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Security-focused</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
