// Run: node --test components/starktext/export.test.ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { stripTags, buildRss, buildStandaloneHtml, type Post } from "./export.ts"

function post(overrides: Partial<Post> = {}): Post {
  return {
    id: "p1",
    slug: "hello",
    title: "HELLO",
    markdown: "hello world",
    status: "PUBLISHED",
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
    published: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

test("stripTags: removes tags, unescapes entities, collapses whitespace", () => {
  assert.equal(stripTags("<p>hello   <strong>world</strong></p>"), "hello world")
  assert.equal(stripTags("<p>&lt;b&gt; &amp; &quot;q&quot; &#39;s&#39;</p>"), '<b> & "q" \'s\'')
})

test("stripTags: trims leading/trailing whitespace produced by stripped tags", () => {
  assert.equal(stripTags("<h1>TITLE</h1>\n<p>body</p>"), "TITLE body")
})

test("buildRss: only PUBLISHED posts are included", () => {
  const xml = buildRss([post({ id: "a", status: "DRAFT" }), post({ id: "b", status: "PUBLISHED" })])
  assert.equal((xml.match(/<item>/g) ?? []).length, 1)
  assert.ok(xml.includes(`<guid>https://starktext.example/hello</guid>`))
})

test("buildRss: escapes title and truncates/escapes description", () => {
  const xml = buildRss([post({ title: "<script>alert(1)</script>", markdown: "a".repeat(300) })])
  assert.ok(!xml.includes("<script>alert"))
  assert.ok(xml.includes("&lt;script&gt;"))
  const desc = /<description>([^<]*)<\/description>/.exec(xml)?.[1] ?? ""
  assert.ok(desc.length <= 200)
})

test("buildRss: falls back to updated date when published is unset", () => {
  const xml = buildRss([post({ published: undefined, updated: "2026-03-15T00:00:00.000Z" })])
  assert.ok(xml.includes(new Date("2026-03-15T00:00:00.000Z").toUTCString()))
})

test("buildRss: markdown's own HTML-escaping keeps a literal CDATA-closer out of the content", () => {
  // compileMarkdown escapes ">" to "&gt;" before buildRss ever sees it, so
  // the only "]]>" left in the feed is the legitimate CDATA terminator.
  const xml = buildRss([post({ markdown: "before ]]> after" })])
  assert.equal((xml.match(/\]\]>/g) ?? []).length, 1)
})

test("buildRss: empty post list still produces valid feed shell", () => {
  const xml = buildRss([])
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
  assert.ok(xml.includes("<channel>"))
  assert.ok(!xml.includes("<item>"))
})

test("buildStandaloneHtml: escapes title, uses UNTITLED fallback, embeds compiled markdown", () => {
  const html = buildStandaloneHtml(post({ title: "", markdown: "# HEADER" }))
  assert.ok(html.includes("<title>UNTITLED</title>"))
  assert.ok(html.includes("<h1>HEADER</h1>"))
})

test("buildStandaloneHtml: escapes unsafe title characters", () => {
  const html = buildStandaloneHtml(post({ title: '<img src=x onerror="alert(1)">' }))
  assert.ok(!html.includes("<img src=x"))
  assert.ok(html.includes("&lt;img src=x"))
})

test("buildStandaloneHtml: date is sliced to YYYY-MM-DD", () => {
  const html = buildStandaloneHtml(post({ published: "2026-07-04T12:34:56.000Z" }))
  assert.ok(html.includes("Published 2026-07-04"))
})
