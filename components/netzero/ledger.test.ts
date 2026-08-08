// Run: node --test components/netzero/ledger.test.ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { parseStoredLedger, buildLedgerCsv } from "./ledger.ts"

test("parseStoredLedger: null/empty input yields null", () => {
  assert.equal(parseStoredLedger(null), null)
  assert.equal(parseStoredLedger(""), null)
})

test("parseStoredLedger: rejects malformed JSON", () => {
  assert.equal(parseStoredLedger("not json"), null)
  assert.equal(parseStoredLedger("{"), null)
})

test("parseStoredLedger: rejects non-object, missing/bad start, non-array entries", () => {
  assert.equal(parseStoredLedger("42"), null)
  assert.equal(parseStoredLedger("null"), null)
  assert.equal(parseStoredLedger(JSON.stringify({ entries: [] })), null)
  assert.equal(parseStoredLedger(JSON.stringify({ start: "100", entries: [] })), null)
  assert.equal(parseStoredLedger(JSON.stringify({ start: 1.5, entries: [] })), null)
  assert.equal(parseStoredLedger(JSON.stringify({ start: 0, entries: "nope" })), null)
})

test("parseStoredLedger: valid ledger round-trips", () => {
  const raw = JSON.stringify({
    start: 1000,
    entries: [{ id: "a", date: "2026-08-01", desc: "COFFEE", cents: -500 }],
  })
  assert.deepEqual(parseStoredLedger(raw), {
    start: 1000,
    entries: [{ id: "a", date: "2026-08-01", desc: "COFFEE", cents: -500 }],
  })
})

test("parseStoredLedger: drops individually malformed entries but keeps valid ones", () => {
  const raw = JSON.stringify({
    start: 0,
    entries: [
      { id: "ok", date: "2026-08-01", desc: "GOOD", cents: 100 },
      { id: "bad-cents", date: "2026-08-01", desc: "BAD", cents: "100" },
      { id: "bad-cents-2", date: "2026-08-01", desc: "BAD", cents: 1.5 },
      { date: "2026-08-01", desc: "MISSING ID", cents: 100 },
      null,
      "garbage",
    ],
  })
  const parsed = parseStoredLedger(raw)
  assert.ok(parsed)
  assert.equal(parsed?.entries.length, 1)
  assert.equal(parsed?.entries[0].id, "ok")
})

test("buildLedgerCsv: header, starting liquidity row, then entries in order", () => {
  const csv = buildLedgerCsv({
    start: 100000,
    entries: [
      { id: "1", date: "2026-08-01", desc: "PAYCHECK", cents: 500000 },
      { id: "2", date: "2026-08-02", desc: "RENT", cents: -200000 },
    ],
  })
  assert.equal(
    csv,
    [
      "date,description,amount",
      ',"STARTING LIQUIDITY",1000.00',
      '2026-08-01,"PAYCHECK",5000.00',
      '2026-08-02,"RENT",-2000.00',
      "",
    ].join("\n")
  )
})

test("buildLedgerCsv: escapes embedded quotes and commas in descriptions", () => {
  const csv = buildLedgerCsv({
    start: 0,
    entries: [{ id: "1", date: "2026-08-01", desc: 'COST, "PLUS" TAX', cents: -100 }],
  })
  assert.ok(csv.includes('"COST, ""PLUS"" TAX"'))
})

test("buildLedgerCsv: empty ledger has just the header and starting row", () => {
  const csv = buildLedgerCsv({ start: 0, entries: [] })
  assert.equal(csv, ["date,description,amount", ',"STARTING LIQUIDITY",0.00', ""].join("\n"))
})
