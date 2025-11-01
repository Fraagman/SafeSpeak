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
    <main className="min-h-screen bg-neutral-950 text-neutral-200">
      <section className="border-b border-neutral-800 bg-neutral-950/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            SafeSpeak: Empowering Voices, Ensuring Evidence
          </h1>
          <p className="mt-6 text-neutral-300 leading-7">
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
      </section>

      <section className="border-b border-neutral-800 bg-neutral-900/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Core Technology & Innovation</h2>
          <ul className="mt-6 space-y-3 text-neutral-300">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span className="leading-7"><strong>End-to-End Encryption (E2E)</strong> — Data remains encrypted from capture to verification, ensuring only intended parties can decrypt.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500"></span>
              <span className="leading-7"><strong>Blockchain Proof of Integrity</strong> — Cryptographic proofs anchor evidence immutably, enabling independent verification of tamper-resistance.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-fuchsia-500"></span>
              <span className="leading-7"><strong>PII Redaction and Face Blurring</strong> — Automated pipelines protect identities while preserving evidential value.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              <span className="leading-7"><strong>Stealth & Quick Exit Safety Features</strong> — Discreet UI patterns and instant safe-exit flows reduce exposure during high-risk use.</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              The Team Behind the Mission - DeadPixel
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="group rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <span className="text-xs text-neutral-400 bg-neutral-800/70 px-2 py-1 rounded-md border border-neutral-700">
                    DeadPixel
                  </span>
                </div>
                <p className="mt-2 text-sm text-emerald-400 font-medium">{member.role}</p>
                <p className="mt-3 text-neutral-300 leading-6">{member.blurb}</p>
                <div className="mt-5 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
                <div className="mt-5 flex items-center gap-2 text-xs text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Security-focused</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
