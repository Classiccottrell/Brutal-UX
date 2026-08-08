// Run: node --test lib/utils.test.ts
// isTypingTarget's `target instanceof HTMLElement` check needs a real
// HTMLElement global; plain Node has none, so install a minimal stand-in
// before importing the module under test.
import { test } from "node:test"
import assert from "node:assert/strict"

class FakeElement {
  tagName: string
  isContentEditable: boolean
  constructor(tagName: string, isContentEditable = false) {
    this.tagName = tagName
    this.isContentEditable = isContentEditable
  }
}
// isTypingTarget only reads HTMLElement when called (inside the tests
// below), so installing the stand-in here — before any call happens — is
// enough even though the import below is hoisted above this line.
;(globalThis as unknown as { HTMLElement: unknown }).HTMLElement = FakeElement

const el = (tagName: string, isContentEditable = false) =>
  new FakeElement(tagName, isContentEditable) as unknown as EventTarget

import { isTypingTarget } from "./utils.ts"

test("null and non-element targets are not typing targets", () => {
  assert.equal(isTypingTarget(null), false)
  assert.equal(isTypingTarget({} as EventTarget), false)
})

test("INPUT, TEXTAREA, and SELECT are typing targets", () => {
  assert.equal(isTypingTarget(el("INPUT")), true)
  assert.equal(isTypingTarget(el("TEXTAREA")), true)
  assert.equal(isTypingTarget(el("SELECT")), true)
})

test("contentEditable elements are typing targets regardless of tag", () => {
  assert.equal(isTypingTarget(el("DIV", true)), true)
})

test("plain, non-editable elements are not typing targets", () => {
  assert.equal(isTypingTarget(el("DIV")), false)
  assert.equal(isTypingTarget(el("BUTTON")), false)
  assert.equal(isTypingTarget(el("BODY")), false)
})
