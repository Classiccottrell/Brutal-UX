// Zero-dep tests. Node strips types natively:
//   node --test components/starktext/markdown.test.ts
import test from "node:test"
import assert from "node:assert/strict"
import { compileMarkdown, escapeHtml, slugify } from "./markdown.ts"

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

test("escapeHtml escapes all five entities directly", () => {
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;")
})

test("unterminated fenced code block runs to EOF instead of dropping content", () => {
  const out = compileMarkdown("```\nline one\nline two")
  assert.equal(out, "<pre><code>line one\nline two</code></pre>")
})

test("consecutive headings of different levels each compile independently", () => {
  assert.equal(
    compileMarkdown("# ONE\n## TWO\n### THREE"),
    "<h1>ONE</h1>\n<h2>TWO</h2>\n<h3>THREE</h3>"
  )
})

test("consecutive blockquote lines join into a single blockquote paragraph", () => {
  assert.equal(
    compileMarkdown("> line one\n> line two"),
    "<blockquote><p>line one line two</p></blockquote>"
  )
})

test("data: scheme links are rejected like javascript:", () => {
  assert.equal(compileMarkdown("[x](data:text/html,evil)"), "<p>x</p>")
})

test("multiple paragraphs separated by a blank line compile as separate <p> blocks", () => {
  assert.equal(compileMarkdown("first\n\nsecond"), "<p>first</p>\n<p>second</p>")
})

test("empty input compiles to empty output", () => {
  assert.equal(compileMarkdown(""), "")
})

test("slugify", () => {
  assert.equal(slugify("Hello, World!"), "hello-world")
  assert.equal(slugify("  WORDS   over --- everything  "), "words-over-everything")
  assert.equal(slugify("already-slugged-123"), "already-slugged-123")
  assert.equal(slugify("!!!"), "")
})
