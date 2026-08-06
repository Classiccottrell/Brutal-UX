import Link from "next/link"

export const metadata = {
  title: "BRUTAL UX — VALIDATION",
  description: "Paradigm stress test: cognitive load, WCAG conflict matrix, A/B protocol, edge cases.",
}

const WCAG_MATRIX = [
  ["C1", "Pure #000/#FFF everywhere (21:1)", "Sustained max contrast → halation/glare for astigmatic readers (~10%)", "AAA-adj", "Keep default; ship user-invoked PAPER MODE (#111 on #F2F2F2, still >12:1). A visible mechanical toggle is more brutalist than silently softening."],
  ["C2", "#FF0000 / #00FF00 as sole encodings", "1.4.1 Use of Color", "A — HARD FAIL", "Color never carries meaning alone: every alert row gets a text prefix (ERR:, OK:) or ▮ glyph. #00FF00 only legal on black (1.4:1 on white)."],
  ["C3", "Zero animation, instant DOM swaps", "2.3.3 Animation from Interactions", "AAA — PASS FREE", "Ship it. prefers-reduced-motion users get the default experience."],
  ["C4", "Zero transitions → zero focus affordance if unstyled", "2.4.7 Focus Visible; 2.4.11 Focus Not Obscured", "AA", "3px solid #FF0000 outline, 0px radius, 2px offset, every focusable. Instant, ugly, unmissable."],
  ["C5", "Dense tables, minimal padding", "2.5.8 Target Size Minimum 24px", "AA", "Keep 13px text; pad interactive cells to ≥24px hit area. Density = information per screen, not pixels per button."],
  ["C6", "ALL-CAPS body copy", "Readability (advisory) — caps remove word-shape cues; ~10–15% slower, worse for dyslexic readers", "ADVISORY", "Uppercase restricted to labels/headings ≤6 words. Body and table data mixed case. Caps become a signal of chrome vs. data."],
  ["C7", "Form labels as bare cells", "1.3.1 Info and Relationships; 3.3.2 Labels or Instructions", "A", "Brutality is a CSS concern; DOM stays semantic: label[for], th[scope], fieldset. No div-soup — screen readers get a better document than most soft UIs."],
  ["C8", "Raw error dumps in-flow", "4.1.3 Status Messages", "AA", "role=\"alert\" / aria-live=\"assertive\" on error blocks. Mechanical honesty must be announced mechanically."],
]

const METRICS = [
  ["TSV", "TASK SUCCESS VELOCITY", "Correct completions per minute per session; report the day-1 → day-30 slope, not point values", "Event-log timestamps; success rubric scored blind"],
  ["ERR", "ERROR RECOVERY RATE", "% of user-caused error states resolved without help; median time-to-recovery", "Error-state instrumentation + recording audit"],
  ["OFI", "OPERATOR FATIGUE INDEX", "Per 90-min session: NASA-TLX + blink-rate delta + within-session error-rate slope", "Survey + webcam blink tracking + logs"],
  ["—", "GUARDRAILS", "SUS at day 1 and day 30; voluntary return rate; rage-click rate", "Standard"],
]

const EDGE_MATRIX = [
  ["Raw latency readout (142ms)", "Trust ↑ — live, measured system", "Neutral-to-noise", "Safe always: glanceable, low-stakes."],
  ["Latency during degradation (8,412ms)", "Trust ↑↑ — system admits distress before failing", "Anxiety ↑ without anchor", "Pair number with bound: 8,412ms — RETRY AT 10,000ms. Number + plan = control; number alone = countdown."],
  ["Raw stack trace on error", "Diagnostic gold", "PANIC THRESHOLD — machine speaking in tongues", "Two-layer error: plain declarative line (WRITE FAILED. YOUR DATA IS INTACT. RETRY BELOW.) + full trace beneath. Never replace the trace — layer it."],
  ["Synchronous \"data not saved\"", "Expected", "Frightening, but trust-building iff paired with consequence + exit", "Three mandatory clauses: WHAT failed, WHAT survived, WHAT to do next. Omitting clause 2 is where honesty becomes cruelty."],
  ["Literal empty state (0 RECORDS)", "Correct", "Reads as breakage", "One line of mechanical orientation: 0 RECORDS. CREATE ONE ABOVE. Zero decoration."],
]

const GUIDELINES = [
  "EVERY DISCLOSED FAILURE CARRIES A NEXT ACTION. Transparency without an exit is a trap, not honesty.",
  "STATE THE BLAST RADIUS. \"YOUR DATA IS INTACT\" (or its honest converse) is the single highest-leverage anti-panic clause. Uncertainty about loss — not the error — produces panic retries and forced reloads: that is how user panic becomes system failure.",
  "SEVERITY IS TYPOGRAPHIC, NOT CHROMATIC-ONLY. Reserve #FF0000 + ERR: for states requiring action, or operators renormalize and true alerts lose signal (alarm fatigue).",
  "HONESTY ABOUT THE FUTURE. Synchronous UIs never leave a frozen frame: show WRITING… 2/5 as literal text. A progress line is a fact, not a delight mechanism.",
  "NEVER FAKE, NEVER SOFTEN, ALWAYS BOUND. Disclose the true value; attach the bound or plan that makes it interpretable.",
]

const AMENDMENTS = [
  ["A1", "Color never sole carrier — text prefix or glyph mandatory on alert/data states. (C2)"],
  ["A2", "Universal 3px #FF0000 focus outline. (C4)"],
  ["A3", "Uppercase restricted to labels/headings; body and data mixed case. (C6)"],
  ["A4", "Two-layer error format (declarative line + raw trace) with blast-radius clause; latency readouts always bounded. (§4)"],
]

const cell = "border-2 border-black p-2 align-top text-[13px]"

export default function Validation() {
  return (
    <main className="bg-white text-black max-w-5xl mx-auto px-4">
      <section className="py-8">
        <Link href="/" className="text-[13px] font-bold uppercase underline" style={{ color: "var(--brutal-blue)" }}>
          ← INDEX
        </Link>
        <h1 className="text-[48px] font-bold uppercase leading-none mt-4">VALIDATION</h1>
        <p className="text-[24px] font-bold uppercase mt-2">
          PARADIGM STRESS TEST. EXECUTED 2026-07-10.
        </p>
        <div className="brutal-border p-4 mt-6">
          <p className="text-[16px] font-bold">
            VERDICT: viable and defensible for expert operator tools with high session frequency
            (ledgers, incident command, publishing — this repo&apos;s three products). Contraindicated
            for novice-facing, low-frequency, or anxiety-adjacent tasks. Four structural amendments
            required for WCAG conformance; none require abandoning brutalist constraints.
          </p>
        </div>
      </section>

      <section className="brutal-divider py-8">
        <h2 className="text-[32px] font-bold uppercase mb-4">01 — COGNITIVE LOAD FRICTION</h2>
        <p className="text-[16px] mb-4">
          Removing soft hierarchy cues does not remove hierarchy — it relocates it from the
          pre-attentive visual channel (~200ms, no working-memory cost) to the semantic/lexical
          channel, which requires foveation and reading. The system trades{" "}
          <span className="font-bold">perceptual bandwidth for reading bandwidth</span>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="brutal-border p-4">
            <h3 className="text-[16px] font-bold uppercase border-b-2 border-black pb-2 mb-3">NOVICE (FIRST ~5 SESSIONS)</h3>
            <p className="text-[13px] mb-2">Expect 20–40% longer time-to-first-action on first exposure: with no elevation cues, &quot;what is clickable&quot; must be read serially, not seen.</p>
            <p className="text-[13px] mb-2">Uniform 2px borders create a wall-of-cells effect — every region has identical visual weight. Whitespace and the 3px dividers carry the entire gestalt load.</p>
            <p className="text-[13px]">Counterweight: zero decorative distractors shrinks the search space. The novice penalty is real but bounded.</p>
          </div>
          <div className="brutal-border p-4">
            <h3 className="text-[16px] font-bold uppercase border-b-2 border-black pb-2 mb-3">EXPERT (&gt;20 SESSIONS)</h3>
            <p className="text-[13px] mb-2">Fixed positions + zero animation → spatial memory fully amortizes. Motor plans replace visual search.</p>
            <p className="text-[13px] mb-2">Synchronous state removes the &quot;did it really save?&quot; verification loop; each action closes its own feedback loop in the same frame.</p>
            <p className="text-[13px]">Dense tabular layouts beat progressive disclosure for expert lookup tasks across the published literature.</p>
          </div>
        </div>
        <p className="text-[13px] font-bold uppercase mt-4 brutal-border p-3">
          Structural requirement: hierarchy is text-borne, so the 48/32/24/16/13 type scale is
          load-bearing. One mis-leveled heading costs more here than in a soft system — there is no
          redundant cue to recover from.
        </p>
      </section>

      <section className="brutal-divider py-8">
        <h2 className="text-[32px] font-bold uppercase mb-4">02 — WCAG 2.2 CONFLICT MATRIX</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black">
            <thead>
              <tr className="bg-black text-white">
                {["#", "CONSTRAINT", "CLASH", "LEVEL", "BRUTALIST REMEDIATION"].map((h) => (
                  <th key={h} className={`${cell} border-white text-left uppercase`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WCAG_MATRIX.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i} className={`${cell} ${i === 3 && c.includes("FAIL") ? "font-bold text-white bg-[#FF0000]" : ""} ${i === 0 || i === 3 ? "font-bold whitespace-nowrap" : ""}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] font-bold uppercase mt-4 brutal-border p-3">
          Two hard Level-A conflicts (C2, C7), both repairable inside the doctrine. The flat DOM is
          structurally favorable to assistive tech; every risk sits at the perceptual layer.
        </p>
      </section>

      <section className="brutal-divider py-8">
        <h2 className="text-[32px] font-bold uppercase mb-4">03 — QUANTITATIVE TESTING PROTOCOL</h2>
        <p className="text-[16px] mb-4">
          Between-subjects A/B (within-subjects is contaminated by spatial-learning carryover).
          Variant A: this build. Variant B: identical feature set and information architecture in a
          modern SaaS skin (shadows, optimistic toasts, skeleton loaders) — isolating the rendering
          paradigm. n ≥ 40 per arm per cohort (novice / expert), d = 0.5, α = .05, β = .20.
          Sessions on days 1, 3, 7, 14, 30: the paradigm&apos;s bet is on the learning curve, so
          single-session tests are structurally biased against it.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black">
            <thead>
              <tr className="bg-black text-white">
                {["KEY", "METRIC", "DEFINITION", "INSTRUMENT"].map((h) => (
                  <th key={h} className={`${cell} border-white text-left uppercase`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i} className={`${cell} ${i < 2 ? "font-bold whitespace-nowrap" : ""}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="brutal-border p-4">
            <h3 className="text-[13px] font-bold uppercase border-b-2 border-black pb-2 mb-2">WIN CONDITION</h3>
            <p className="text-[13px]">Expert TSV slope superior; ERR ≥ parity; day-30 SUS ≥ parity — even if day-1 SUS loses badly (it will).</p>
          </div>
          <div className="brutal-border p-4">
            <h3 className="text-[13px] font-bold uppercase border-b-2 border-black pb-2 mb-2">FAIL CONDITION</h3>
            <p className="text-[13px]">OFI significantly worse at day 30 (halation/caps fatigue), or novice ERR inferior — honesty producing confusion, not transparency.</p>
          </div>
          <div className="brutal-border p-4">
            <h3 className="text-[13px] font-bold uppercase border-b-2 border-black pb-2 mb-2" style={{ color: "#FF0000" }}>KILL CRITERION</h3>
            <p className="text-[13px]">Novice day-7 abandonment &gt;2× variant B. No learning-curve argument survives users who never reach the curve.</p>
          </div>
        </div>
      </section>

      <section className="brutal-divider py-8">
        <h2 className="text-[32px] font-bold uppercase mb-4">04 — EDGE CASE MATRIX: HONESTY VS. PANIC</h2>
        <p className="text-[16px] mb-4">
          Transparency builds trust only when the disclosed signal is actionable or interpretable
          by its reader. Disclosure the reader cannot act on converts into perceived loss of
          control — and perceived control, not information volume, is the trust variable. Honesty
          is an asset with a competence-dependent yield curve.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black">
            <thead>
              <tr className="bg-black text-white">
                {["DISCLOSURE", "EXPERT", "NOVICE", "THRESHOLD RULE"].map((h) => (
                  <th key={h} className={`${cell} border-white text-left uppercase`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EDGE_MATRIX.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i} className={`${cell} ${c.includes("PANIC") ? "font-bold text-white bg-[#FF0000]" : ""}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-[24px] font-bold uppercase mt-6 mb-3">STRUCTURAL GUIDELINES</h3>
        <ol className="brutal-border">
          {GUIDELINES.map((g, i) => (
            <li key={i} className={`flex gap-4 p-3 text-[13px] ${i > 0 ? "border-t-2 border-black" : ""}`}>
              <span className="font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span>{g}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="brutal-divider py-8">
        <h2 className="text-[32px] font-bold uppercase mb-4">AMENDMENTS ADOPTED</h2>
        <div className="brutal-border">
          {AMENDMENTS.map(([id, text], i) => (
            <div key={id} className={`flex gap-4 p-3 text-[13px] ${i > 0 ? "border-t-2 border-black" : ""}`}>
              <span className="font-bold shrink-0">{id}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="brutal-divider py-6 text-[13px] font-bold uppercase">
        <Link href="/" className="underline mr-4" style={{ color: "var(--brutal-blue)" }}>/INDEX</Link>
        <Link href="/netzero" className="underline mr-4" style={{ color: "var(--brutal-blue)" }}>/NETZERO</Link>
        <Link href="/terminal-red" className="underline mr-4" style={{ color: "var(--brutal-blue)" }}>/TERMINAL-RED</Link>
        <Link href="/starktext" className="underline mr-4" style={{ color: "var(--brutal-blue)" }}>/STARKTEXT</Link>
        <Link href="/cobalt-systems" className="underline" style={{ color: "var(--brutal-blue)" }}>/COBALT-SYSTEMS</Link>
      </footer>
    </main>
  )
}
