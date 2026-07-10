// Run from app root: node --test components/netzero/money.test.ts
import test from "node:test"
import assert from "node:assert/strict"

import { parseDollarsToCents, formatCents, centsToDecimalString } from "./money.mjs"

test("parses plain integers", () => {
  assert.equal(parseDollarsToCents("1234"), 123400)
  assert.equal(parseDollarsToCents("0"), 0)
  assert.equal(parseDollarsToCents("+10"), 1000)
})

test("parses grouped, prefixed, decimal forms", () => {
  assert.equal(parseDollarsToCents("1,234.56"), 123456)
  assert.equal(parseDollarsToCents("$12.50"), 1250)
  assert.equal(parseDollarsToCents("$1,000,000"), 100000000)
  assert.equal(parseDollarsToCents("0.5"), 50) // single decimal pads to 50c
  assert.equal(parseDollarsToCents(".75"), 75)
  assert.equal(parseDollarsToCents(" 42 "), 4200) // trimmed
})

test("parses negatives", () => {
  assert.equal(parseDollarsToCents("-40"), -4000)
  assert.equal(parseDollarsToCents("-$0.99"), -99)
  assert.equal(parseDollarsToCents("-0"), 0) // no negative zero
})

test("rejects garbage", () => {
  for (const bad of [
    "", " ", "abc", "$", "-", ".", "--5", "12.345", "12.", "1,23",
    "12,345,6", "1 234", "NaN", "Infinity", "-Infinity", "1e5", "0x10",
    "12..5", "$$5", "5-",
  ]) {
    assert.equal(parseDollarsToCents(bad), null, `should reject ${JSON.stringify(bad)}`)
  }
})

test("rejects unsafe magnitudes", () => {
  assert.equal(parseDollarsToCents("99999999999999999999"), null)
})

test("formats cents", () => {
  assert.equal(formatCents(123456), "$1,234.56")
  assert.equal(formatCents(-4000), "-$40.00")
  assert.equal(formatCents(0), "$0.00")
  assert.equal(formatCents(-1), "-$0.01")
  assert.equal(formatCents(5), "$0.05")
  assert.equal(formatCents(100000000), "$1,000,000.00")
})

test("round-trips parse -> format", () => {
  for (const [input, out] of [
    ["1,234.56", "$1,234.56"],
    ["$12.50", "$12.50"],
    ["-40", "-$40.00"],
    ["1234", "$1,234.00"],
  ] as const) {
    const cents = parseDollarsToCents(input)
    assert.notEqual(cents, null)
    assert.equal(formatCents(cents as number), out)
  }
})

test("csv decimal string", () => {
  assert.equal(centsToDecimalString(123456), "1234.56")
  assert.equal(centsToDecimalString(-4000), "-40.00")
  assert.equal(centsToDecimalString(0), "0.00")
})
