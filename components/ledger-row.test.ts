// Run: node --test components/ledger-row.test.ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { validateRow } from "./ledger-row.ts"

test("valid task and numeric value", () => {
  assert.deepEqual(validateRow("Ship it", "42.5"), { ok: true, task: "Ship it", value: 42.5 })
})

test("trims the task", () => {
  assert.deepEqual(validateRow("  padded  ", "1"), { ok: true, task: "padded", value: 1 })
})

test("empty/whitespace-only task is bad", () => {
  assert.deepEqual(validateRow("", "1"), { ok: false, taskBad: true, valueBad: false })
  assert.deepEqual(validateRow("   ", "1"), { ok: false, taskBad: true, valueBad: false })
})

test("non-finite value is bad", () => {
  assert.deepEqual(validateRow("task", ""), { ok: false, taskBad: false, valueBad: true })
  assert.deepEqual(validateRow("task", "abc"), { ok: false, taskBad: false, valueBad: true })
  assert.deepEqual(validateRow("task", "NaN"), { ok: false, taskBad: false, valueBad: true })
  assert.deepEqual(validateRow("task", "Infinity"), { ok: false, taskBad: false, valueBad: true })
})

test("both bad reports both flags", () => {
  assert.deepEqual(validateRow("  ", "nope"), { ok: false, taskBad: true, valueBad: true })
})

test("parseFloat leniency: numeric prefix is accepted, matching legacy behavior", () => {
  assert.deepEqual(validateRow("task", "3.14abc"), { ok: true, task: "task", value: 3.14 })
})

test("negative and zero values are valid", () => {
  assert.deepEqual(validateRow("task", "-5"), { ok: true, task: "task", value: -5 })
  assert.deepEqual(validateRow("task", "0"), { ok: true, task: "task", value: 0 })
})
