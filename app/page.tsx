import Link from "next/link"

import { Ledger } from "@/components/ledger"
import { Repository } from "@/components/repository"

const LENSES = [
  {
    title: "ZERO-TARIFF INTERFACES",
    copy: "EVERY MECHANISM EXPOSED IMMEDIATELY. NO ONBOARDING TAX, NO TOOLTIPS, NO PROGRESSIVE DISCLOSURE. IF THE USER MUST BE TAUGHT, THE INTERFACE HAS ALREADY FAILED.",
  },
  {
    title: "THE SCARCITY ENGINE",
    copy: "EVERY NON-TRANSACTIONAL PIXEL IS DELETED. IF IT DOES NOT MOVE THE TRANSACTION, IT DOES NOT EXIST. DECORATION IS THEFT OF ATTENTION.",
  },
  {
    title: "SLAPSTICK CAUSE-AND-EFFECT",
    copy: "INPUT → CONSEQUENCE IN THE SAME FRAME. BINARY, UNBUFFERED, LIKE AN ANVIL DROPPING. THE MACHINE DOES NOT EASE. THE MACHINE OBEYS.",
  },
]

const TYPE_SCALE = [
  { px: 48, label: "48PX / DISPLAY" },
  { px: 32, label: "32PX / SECTION" },
  { px: 24, label: "24PX / HEADING" },
  { px: 16, label: "16PX / BODY" },
  { px: 13, label: "13PX / LABEL" },
]

const PALETTE = [
  { hex: "#000000", role: "STRUCTURE", bg: "#000000", fg: "#FFFFFF" },
  { hex: "#FFFFFF", role: "VOID", bg: "#FFFFFF", fg: "#000000" },
  { hex: "#FF0000", role: "ALERT", bg: "#FF0000", fg: "#FFFFFF" },
  { hex: "#00FF00", role: "DATA", bg: "#00FF00", fg: "#000000" },
  { hex: "#0000EE", role: "LINK", bg: "#0000EE", fg: "#FFFFFF" },
]

export default function Home() {
  return (
    <main className="bg-white text-black max-w-5xl mx-auto px-4">
      {/* SECTION 01 — MANIFESTO & TOKENS */}
      <section className="py-8">
        <h1 className="text-[48px] font-bold uppercase leading-none">BRUTAL UX</h1>
        <p className="text-[24px] font-bold uppercase mt-2 mb-8">
          UTILITY IS THE ONLY AESTHETIC.
        </p>

        <h2 className="text-[32px] font-bold uppercase mb-4">
          SECTION 01 — MANIFESTO &amp; TOKENS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {LENSES.map((l) => (
            <div key={l.title} className="brutal-border p-4">
              <h3 className="text-[16px] font-bold uppercase border-b-2 border-black pb-2 mb-3">
                {l.title}
              </h3>
              <p className="text-[13px] font-bold">{l.copy}</p>
            </div>
          ))}
        </div>

        <h3 className="text-[24px] font-bold uppercase mb-3">TYPOGRAPHY SCALE</h3>
        <div className="brutal-border mb-8">
          {TYPE_SCALE.map((t, i) => (
            <div
              key={t.px}
              className={`flex items-baseline gap-4 p-3 ${i > 0 ? "border-t-2 border-black" : ""}`}
            >
              <span className="text-[13px] font-bold uppercase w-32 shrink-0">{t.label}</span>
              <span className="font-bold uppercase leading-none" style={{ fontSize: t.px }}>
                MONOSPACE OR NOTHING
              </span>
            </div>
          ))}
        </div>

        <h3 className="text-[24px] font-bold uppercase mb-3">COLOR PALETTE</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {PALETTE.map((c) => (
            <div key={c.hex} className="brutal-border">
              <div
                className="h-20 flex items-center justify-center font-bold"
                style={{ background: c.bg, color: c.fg }}
              >
                {c.hex}
              </div>
              <div className="border-t-2 border-black p-2 text-[13px] font-bold uppercase">
                {c.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 02 — BRUTAL COMPONENT REPOSITORY */}
      <Repository />

      {/* SECTION 03 — APPLICATION SPECIMEN */}
      <section className="brutal-divider py-8">
        <h2 className="text-[32px] font-bold uppercase mb-2">
          SECTION 03 — APPLICATION SPECIMEN
        </h2>
        <h3 className="text-[24px] font-bold uppercase mb-6">THE NO-BULLSH*T LEDGER</h3>
        <Ledger />
      </section>

      <footer className="brutal-divider py-6 text-[13px] font-bold uppercase">
        <span className="mr-4">SPECIMENS:</span>
        <Link href="/netzero" className="underline mr-4" style={{ color: "var(--brutal-blue)" }}>
          /NETZERO
        </Link>
        <Link href="/terminal-red" className="underline mr-4" style={{ color: "var(--brutal-blue)" }}>
          /TERMINAL-RED
        </Link>
        <Link href="/starktext" className="underline mr-4" style={{ color: "var(--brutal-blue)" }}>
          /STARKTEXT
        </Link>
        <Link href="/validation" className="underline" style={{ color: "var(--brutal-blue)" }}>
          /VALIDATION
        </Link>
      </footer>
    </main>
  )
}
