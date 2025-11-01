import QuickExit from "@/components/QuickExit";
import StealthToggle from "@/components/StealthToggle";
import Link from "next/link";

export default function Page() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <QuickExit />
      <h1 className="text-2xl font-semibold">SafeSpeak</h1>
      <StealthToggle />
      <div className="grid gap-3">
        <Link className="block px-4 py-3 rounded bg-sky-500 text-white text-center" href="/report/new">Create Report</Link>
        <Link className="block px-4 py-3 rounded bg-sky-500 text-white text-center" href="/resources">Local Resources</Link>
        <Link className="block px-4 py-3 rounded bg-sky-500 text-white text-center" href="/settings">Settings</Link>
      </div>
    </main>
  );
}