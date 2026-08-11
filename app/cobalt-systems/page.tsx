import Link from "next/link"
import { Comments } from "@/components/comments"
import { PositionPinsLayer } from "@/components/comments/position-pins-layer"

const INVARIANTS = [
  "TWO-COLOUR SYSTEM — INK AND PAPER ONLY.",
  "ONE DOMINANT SUBJECT PER COMPOSITION.",
  "HARD GEOMETRY — RECTANGLES, RULES, STEPPED CONTOURS.",
  "SWISS HIERARCHY — SCALE CONTRAST, VISIBLE GRID.",
  "FLAT REPRODUCTION — NO LIGHT, NO GLOSS, NO GRADIENT.",
  "CONTROLLED TEXTURE — LOCALIZED, NEVER A FILTER.",
  "DISCIPLINED DENSITY — SPARSE STUDY OR DENSE POSTER, NOT BOTH.",
]

const POSTER_META = [
  { k: "SYSTEM", v: "BRUTAL/COBALT" },
  { k: "INDEX", v: "01 / 06" },
  { k: "GRID", v: "6 COL · 1U GUTTER" },
  { k: "MODE", v: "TECHNICAL POSTER" },
]

const STEPS = [5, 4, 3, 2, 1, 0]

export default function CobaltSystemsPage() {
  return (
    <main className="bg-white text-black max-w-5xl mx-auto px-4 relative">
      <PositionPinsLayer />
      <section className="py-8">
        <Link href="/" className="underline text-[13px] font-bold uppercase" style={{ color: "var(--brutal-blue)" }}>
          ← INDEX
        </Link>

        <h1 className="text-[48px] font-bold uppercase leading-none mt-4">COBALT SYSTEMS</h1>
        <p className="text-[24px] font-bold uppercase mt-2 mb-2">ONE GRID. ONE INK. NO DECORATION.</p>
        <p className="text-[13px] font-bold uppercase mb-8 max-w-2xl">
          THIS PAGE IS BUILT FROM design.md — THE COBALT SYSTEMS MODERNISM SPEC — RUN THROUGH THE
          SAME BRUTAL UX COMPONENTS AS THE REST OF THIS SITE. THE PRIMARY INK BELOW IS THE SAME
          SWAPPABLE TOKEN AS EVERYWHERE ELSE: FLIP IT (PRESS &quot;C&quot;) AND THIS PAGE BECOMES THE
          ACTUAL TWO-INK SYSTEM, NOT AN ILLUSTRATION OF IT.
        </p>

        <h2 className="text-[32px] font-bold uppercase mb-4">TOKENS</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="brutal-border">
            <div
              className="h-24 flex items-center justify-center font-bold text-[13px]"
              style={{ background: "var(--brutal-black)", color: "var(--brutal-white)" }}
            >
              ink-cobalt #1233C7
            </div>
            <div className="border-t-2 border-black p-2 text-[13px] font-bold uppercase">
              STRUCTURE — TYPE, RULES, FILLS
            </div>
          </div>
          <div className="brutal-border">
            <div
              className="h-24 flex items-center justify-center font-bold text-[13px]"
              style={{ background: "var(--brutal-white)", color: "var(--brutal-black)" }}
            >
              paper-white #F7F6F1
            </div>
            <div className="border-t-2 border-black p-2 text-[13px] font-bold uppercase">
              GROUND — NEGATIVE SPACE, KNOCKOUT
            </div>
          </div>
        </div>

        <h2 className="text-[32px] font-bold uppercase mb-4">SEVEN INVARIANTS</h2>
        <ol className="brutal-border mb-8">
          {INVARIANTS.map((rule, i) => (
            <li
              key={rule}
              className={`flex gap-4 p-3 text-[13px] font-bold uppercase ${i > 0 ? "border-t-2 border-black" : ""}`}
            >
              <span className="w-6 shrink-0">{i + 1}</span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>

        {/* MODE A — TECHNICAL POSTER */}
        <h2 className="text-[32px] font-bold uppercase mb-2">MODE A — TECHNICAL POSTER</h2>
        <p className="text-[13px] font-bold uppercase mb-4">
          ONE HERO SUBJECT. OVERSIZED INDEX. RESTRAINED METADATA. LOCALIZED DITHER.
        </p>
        <div className="brutal-border p-6 mb-8 relative">
          <span className="absolute top-2 left-2 text-[13px] font-bold leading-none">+</span>
          <span className="absolute top-2 right-2 text-[13px] font-bold leading-none">+</span>
          <span className="absolute bottom-2 left-2 text-[13px] font-bold leading-none">+</span>
          <span className="absolute bottom-2 right-2 text-[13px] font-bold leading-none">+</span>

          <div className="flex items-start justify-between mb-6">
            <span className="font-bold leading-none" style={{ fontSize: 96 }}>
              01
            </span>
            <span className="text-[24px] font-bold uppercase text-right leading-tight max-w-[16ch]">
              COMPONENT
              <br />
              REPOSITORY
            </span>
          </div>

          <div className="relative h-56 border-2 border-black mb-6 overflow-hidden">
            {/* dithered ground, localized to this panel only */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(var(--brutal-black) 1px, transparent 1.5px)",
                backgroundSize: "10px 10px",
                opacity: 0.15,
              }}
            />
            {/* isometric-ish stacked modules standing in for the repository */}
            <div className="absolute inset-0 flex items-end justify-center gap-3 pb-6">
              {[40, 70, 55, 90, 65].map((h, i) => (
                <div
                  key={i}
                  className="w-10 border-2 border-black bg-white"
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px border-2 border-black bg-black text-[13px] font-bold uppercase">
            {POSTER_META.map((m) => (
              <div key={m.k} className="bg-white p-2">
                {m.k}
                <br />
                {m.v}
              </div>
            ))}
          </div>
        </div>

        {/* MODE B — OPTICAL LINE STUDY */}
        <h2 className="text-[32px] font-bold uppercase mb-2">MODE B — OPTICAL LINE STUDY</h2>
        <p className="text-[13px] font-bold uppercase mb-4">
          ONE MOTIF. ONE OPERATION. HERE: A STEPPED, CONSTANT-OFFSET REPEAT.
        </p>
        <div className="brutal-border flex items-center justify-center py-16 mb-8 overflow-hidden">
          <div className="relative inline-block" style={{ lineHeight: 0.8 }}>
            <span className="invisible font-bold uppercase" style={{ fontSize: 220 }}>
              B
            </span>
            {STEPS.map((n) => (
              <span
                key={n}
                aria-hidden={n !== 0}
                className="absolute inset-0 font-bold uppercase select-none"
                style={{
                  fontSize: 220,
                  color: "var(--brutal-black)",
                  transform: `translate(${n * 8}px, ${n * 8}px)`,
                  zIndex: STEPS.length - n,
                }}
              >
                B
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-[24px] font-bold uppercase mb-3">ANTI-DRIFT CHECKLIST</h2>
        <div className="brutal-border mb-8">
          {[
            "EXACTLY TWO INKS ON SCREEN",
            "ONE DOMINANT SUBJECT PER SPECIMEN",
            "ONE COMPOSITION MODE SELECTED",
            "FLAT — NO GRADIENT, NO SHADOW, NO GLOW",
          ].map((c, i) => (
            <div
              key={c}
              className={`flex items-center gap-3 p-3 text-[13px] font-bold uppercase ${i > 0 ? "border-t-2 border-black" : ""}`}
            >
              <span className="border-2 border-black w-5 h-5 shrink-0" />
              {c}
            </div>
          ))}
        </div>

        <p className="text-[13px] font-bold uppercase mb-8">
          FULL SPEC: <code className="border-2 border-black px-1">/design.md</code> AT THE REPOSITORY ROOT.
        </p>
      </section>

      <section className="brutal-divider py-8">
        <h2 className="text-[32px] font-bold uppercase mb-6">DISCUSSION</h2>
        <Comments />
      </section>

      <footer className="brutal-divider py-6 text-[13px] font-bold uppercase">
        <Link href="/" className="underline mr-4" style={{ color: "var(--brutal-blue)" }}>
          /INDEX
        </Link>
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
