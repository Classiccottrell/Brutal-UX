// Run: node --test components/terminal-red/sim.test.ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { initSim, stepSim, execCommand, ringPush, mulberry32, availableCommands } from "./sim.ts"

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

test("DRAIN sets DRAINED status and zeroes reqRate; SEVERED is immune to DRAIN", () => {
  const rng = mulberry32(1)
  let s = initSim(rng)
  s = execCommand(s, "NODE-01", "DRAIN", rng)
  const drained = s.nodes.find((n) => n.id === "NODE-01")
  assert.equal(drained?.status, "DRAINED")
  assert.equal(drained?.reqRate, 0)

  s = execCommand(s, "NODE-02", "KILL", rng)
  s = execCommand(s, "NODE-02", "DRAIN", rng)
  assert.equal(s.nodes.find((n) => n.id === "NODE-02")?.status, "SEVERED")
})

test("stepSim keeps a DRAINED node's reqRate at 0", () => {
  const rng = mulberry32(2)
  let s = initSim(rng)
  s = execCommand(s, "NODE-01", "DRAIN", rng)
  for (let i = 0; i < 100; i++) {
    s = stepSim(s, rng)
    const n = s.nodes.find((x) => x.id === "NODE-01")
    assert.equal(n?.status, "DRAINED")
    assert.equal(n?.reqRate, 0)
  }
})

test("RESTART resurrects a SEVERED node back to OK", () => {
  const rng = mulberry32(3)
  let s = initSim(rng)
  s = execCommand(s, "NODE-01", "KILL", rng)
  assert.equal(s.nodes.find((n) => n.id === "NODE-01")?.status, "SEVERED")
  s = execCommand(s, "NODE-01", "RESTART", rng)
  assert.equal(s.nodes.find((n) => n.id === "NODE-01")?.status, "OK")
})

test("RESTART resurrects a DRAINED node back to OK", () => {
  const rng = mulberry32(4)
  let s = initSim(rng)
  s = execCommand(s, "NODE-01", "DRAIN", rng)
  assert.equal(s.nodes.find((n) => n.id === "NODE-01")?.status, "DRAINED")
  s = execCommand(s, "NODE-01", "RESTART", rng)
  assert.equal(s.nodes.find((n) => n.id === "NODE-01")?.status, "OK")
})

test("a second incident increments incidentSeq and gets a fresh id", () => {
  const rng = mulberry32(7)
  let s = initSim(rng)
  for (let i = 0; i < 5000 && !s.incidentId; i++) s = stepSim(s, rng)
  assert.equal(s.incidentId, "INC-001")
  for (const n of s.nodes.filter((x) => x.status === "CRITICAL")) {
    s = execCommand(s, n.id, "RESTART", rng)
  }
  assert.equal(s.incidentId, null)

  let ticks = 0
  while (!s.incidentId && ticks < 20000) {
    s = stepSim(s, rng)
    ticks++
  }
  assert.ok(s.incidentId, "second incident should spawn")
  assert.equal(s.incidentId, "INC-002")
  assert.equal(s.incidentSeq, 2)
})

test("availableCommands: SEVERED only offers RESTART, DRAINED excludes DRAIN, OK/CRITICAL offer all three", () => {
  assert.deepEqual(availableCommands("SEVERED"), ["RESTART"])
  assert.deepEqual(availableCommands("DRAINED"), ["KILL", "RESTART"])
  assert.deepEqual(availableCommands("OK"), ["KILL", "RESTART", "DRAIN"])
  assert.deepEqual(availableCommands("CRITICAL"), ["KILL", "RESTART", "DRAIN"])
})
