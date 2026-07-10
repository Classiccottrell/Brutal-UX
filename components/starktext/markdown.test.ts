// Zero-dep tests. Node 24 strips types natively:
//   node --test components/starktext/markdown.test.ts
import test from "node:test"
import assert from "node:assert/strict"

// Node needs the real .ts extension at runtime; tsconfig lacks
// allowImportingTsExtensions, so resolve dynamically and cast for types.
const { compileMarkdown, slugify } = (await import(
  "./markdown" + ".ts"
)) as typeof import("./markdown")

test("headings compile", () => {
  assert.equal(compileMarkdown("# HELLO"), "<h1>HELLO</h1>")
  assert.equal(compileMarkdown("## SECTION"), "<h2>SECTION</h2>")
  assert.equal(compileMarkdown("### SUB"), "<h3>SUB</h3>")
})

test("bold, italic, inline code compile", () => {
  assert.equal(
    compileMarkdown("**bold** *italic* `code`"),
    "<p><strong>bold</strong> <em>italic</em> <code>code</code></p>"
  )
})

test("links compile; unsafe schemes are dropped", () => {
  assert.equal(
    compileMarkdown("[HN](https://news.ycombinator.com)"),
    '<p><a href="https://news.ycombinator.com">HN</a></p>'
  )
  assert.equal(compileMarkdown("[x](javascript:void0)"), "<p>x</p>")
  assert.ok(!compileMarkdown("[x](javascript:alert(1))").includes("<a"))
})

test("fenced code block preserves content and escapes <script>", () => {
  const out = compileMarkdown("```\n<script>alert(1)</script>\nline two\n```")
  assert.equal(
    out,
    "<pre><code>&lt;script&gt;alert(1)&lt;/script&gt;\nline two</code></pre>"
  )
  assert.ok(!out.includes("<script"))
})

test("raw HTML in a paragraph is escaped", () => {
  const out = compileMarkdown('before <img src=x onerror="alert(1)"> after')
  assert.ok(out.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"))
  assert.ok(!out.includes("<img"))
})

test("inline code escapes HTML and blocks other inline rules", () => {
  assert.equal(compileMarkdown("`<b>`"), "<p><code>&lt;b&gt;</code></p>")
  assert.equal(compileMarkdown("`**not bold**`"), "<p><code>**not bold**</code></p>")
})

test("lists and blockquotes compile", () => {
  assert.equal(compileMarkdown("- one\n- two"), "<ul><li>one</li><li>two</li></ul>")
  assert.equal(compileMarkdown("> stark"), "<blockquote><p>stark</p></blockquote>")
})

test("slugify", () => {
  assert.equal(slugify("Hello, World!"), "hello-world")
  assert.equal(slugify("  WORDS   over --- everything  "), "words-over-everything")
  assert.equal(slugify("already-slugged-123"), "already-slugged-123")
  assert.equal(slugify("!!!"), "")
})
