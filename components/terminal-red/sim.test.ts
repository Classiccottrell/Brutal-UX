// Run: node --test components/terminal-red/sim.test.ts
// Computed specifier keeps tsc happy (no allowImportingTsExtensions) while
// Node's native type stripping requires the explicit .ts extension.
import { test } from "node:test"
import assert from "node:assert/strict"

const sim = (await import("./sim" + ".ts")) as typeof import("./sim")
const { initSim, stepSim, execCommand, ringPush, mulberry32 } = sim

test("ringPush prepends newest-first and enforces the cap", () => {
  let buf: number[] = []
  for (let i = 1; i <= 105; i++) buf = ringPush(buf, i, 100)
  assert.equal(buf.length, 100)
  assert.equal(buf[0], 105) // newest first
  assert.equal(buf[99], 6) // oldest five evicted
})

test("stepSim never resurrects a SEVERED node", () => {
  const rng = mulberry32(42)
  let s = initSim(rng)
  s = execCommand(s, "NODE-03", "KILL", rng)
  assert.equal(s.nodes.find((n) => n.id === "NODE-03")?.status, "SEVERED")
  for (let i = 0; i < 500; i++) {
    s = stepSim(s, rng)
    assert.equal(s.nodes.find((n) => n.id === "NODE-03")?.status, "SEVERED")
  }
})

test("CRITICAL persists across ticks; RESTART clears it and closes the incident", () => {
  const rng = mulberry32(7)
  let s = initSim(rng)
  for (let i = 0; i < 5000 && !s.incidentId; i++) s = stepSim(s, rng)
  assert.ok(s.incidentId, "incident should spawn within 5000 ticks")
  const critId = s.nodes.find((n) => n.status === "CRITICAL")?.id
  assert.ok(critId)
  for (let i = 0; i < 50; i++) s = stepSim(s, rng)
  const crit = s.nodes.find((n) => n.id === critId)
  assert.equal(crit?.status, "CRITICAL")
  assert.ok(crit !== undefined && crit.cpu >= 95, "critical node pegs cpu at 95+")
  for (const n of s.nodes.filter((x) => x.status === "CRITICAL")) {
    s = execCommand(s, n.id, "RESTART", rng)
  }
  assert.equal(s.incidentId, null)
  assert.ok(s.lastEvents.some((e) => e.kind === "INCIDENT_CLOSE"))
  assert.equal(s.nodes.find((n) => n.id === critId)?.status, "OK")
})
