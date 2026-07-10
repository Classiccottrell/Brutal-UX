"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { compileMarkdown, escapeHtml, slugify } from "@/components/starktext/markdown"

const STORAGE_KEY = "starktext.v1"
const FEED_ORIGIN = "https://starktext.example"

type Post = {
  id: string
  slug: string
  title: string
  markdown: string
  status: "DRAFT" | "PUBLISHED"
  created: string
  updated: string
  published?: string
}

type View = { kind: "INDEX" } | { kind: "EDITOR"; id: string } | { kind: "READER"; id: string }

const MANIFESTO_MD = `Your last platform measured your readers. It tracked their eyes, timed their attention, and sold the aggregate.

We built the opposite. You write markdown. They read text. Nothing watches either of you.

**No likes. No comments. No algorithm. No pixel.**

If your writing needs an engagement loop to survive, let it die. If it needs readers, publish it here and send the link.

> StarkText. The raw utility of words delivered via HTTP.`

function nowISO(): string {
  return new Date().toISOString()
}

function newId(): string {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

function seedPost(): Post {
  const t = nowISO()
  return {
    id: newId(),
    slug: "words-over-everything",
    title: "WORDS OVER EVERYTHING",
    markdown: MANIFESTO_MD,
    status: "PUBLISHED",
    created: t,
    updated: t,
    published: t,
  }
}

function download(filename: string, mime: string, data: string): void {
  const url = URL.createObjectURL(new Blob([data], { type: mime }))
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Compiled HTML -> plain text (compiler only ever emits these 5 entities).
function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

function buildRss(posts: Post[]): string {
  const items = posts
    .filter((p) => p.status === "PUBLISHED")
    .map((p) => {
      const html = compileMarkdown(p.markdown)
      const description = escapeHtml(stripTags(html).slice(0, 200))
      const cdata = html.replace(/\]\]>/g, "]]]]><![CDATA[>")
      return [
        "    <item>",
        `      <title>${escapeHtml(p.title || "UNTITLED")}</title>`,
        `      <link>${FEED_ORIGIN}/${p.slug}</link>`,
        `      <guid>${FEED_ORIGIN}/${p.slug}</guid>`,
        `      <pubDate>${new Date(p.published ?? p.updated).toUTCString()}</pubDate>`,
        `      <description>${description}</description>`,
        `      <content:encoded><![CDATA[${cdata}]]></content:encoded>`,
        "    </item>",
      ].join("\n")
    })
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>STARKTEXT</title>
    <link>${FEED_ORIGIN}/</link>
    <description>NO LIKES. NO COMMENTS. NO ALGORITHM. NO TRACKING. WORDS DELIVERED VIA HTTP.</description>
${items}
  </channel>
</rss>
`
}

// One inline stylesheet, under 2KB. Zero scripts. The core artifact.
const EXPORT_STYLE = [
  'body{margin:0;background:#fff;color:#000;font:16px/1.55 ui-monospace,"SF Mono",Menlo,Consolas,monospace}',
  "main{max-width:72ch;margin:0 auto;padding:32px 16px}",
  "h1,h2,h3{text-transform:uppercase;line-height:1.15}",
  "h1{font-size:28px}h2{font-size:21px}h3{font-size:16px}",
  "p,ul,blockquote,pre{margin:0 0 16px}",
  "a{color:#0000EE;text-decoration:underline}",
  "ul{list-style:square;padding-left:24px}",
  "blockquote{border-left:4px solid #000;padding-left:16px;font-weight:700}",
  "pre{border:2px solid #000;padding:12px;overflow-x:auto}",
  "code{font-weight:700}",
  "hr{border:0;border-top:2px solid #000;margin:24px 0}",
  ".byline,footer p{text-transform:uppercase;font-weight:700;font-size:13px}",
  "@media (prefers-color-scheme:dark){body{background:#000;color:#fff}blockquote,pre{border-color:#fff}hr{border-top-color:#fff}a{color:#99f}}",
].join("")

function buildStandaloneHtml(post: Post): string {
  const title = escapeHtml(post.title || "UNTITLED")
  const date = (post.published ?? post.updated).slice(0, 10)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${EXPORT_STYLE}</style>
</head>
<body>
<main>
<article>
<h1>${title}</h1>
<p class="byline">Published ${date}</p>
<hr>
${compileMarkdown(post.markdown)}
</article>
<footer>
<hr>
<p>PUBLISHED ON STARKTEXT. NO TRACKING. VIEW SOURCE.</p>
</footer>
</main>
</body>
</html>
`
}

const TH = "border-2 border-black p-2 text-left uppercase"
const TD = "border-2 border-black p-2 align-top"
const ROW_ACTION = "underline uppercase font-bold"

export default function StarkTextStudio() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [view, setView] = useState<View>({ kind: "INDEX" })

  // localStorage is read after mount only — pages prerender statically.
  useEffect(() => {
    let loaded: Post[] | null = null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { posts?: Post[] }
        if (Array.isArray(parsed.posts)) loaded = parsed.posts
      }
    } catch {
      // corrupted store -> reseed
    }
    setPosts(loaded ?? [seedPost()])
  }, [])

  useEffect(() => {
    if (posts) window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts }))
  }, [posts])

  const updatePost = (id: string, patch: Partial<Post>) =>
    setPosts((ps) => (ps ?? []).map((p) => (p.id === id ? { ...p, ...patch, updated: nowISO() } : p)))

  const deletePost = (id: string) => {
    setPosts((ps) => (ps ?? []).filter((p) => p.id !== id))
    setView({ kind: "INDEX" })
  }

  const createPost = () => {
    const t = nowISO()
    const p: Post = {
      id: newId(),
      slug: "untitled",
      title: "",
      markdown: "",
      status: "DRAFT",
      created: t,
      updated: t,
    }
    setPosts((ps) => [p, ...(ps ?? [])])
    setView({ kind: "EDITOR", id: p.id })
  }

  const active = posts && view.kind !== "INDEX" ? (posts.find((p) => p.id === view.id) ?? null) : null
  const mode: View["kind"] = view.kind !== "INDEX" && active ? view.kind : "INDEX"

  return (
    <main className="bg-white text-black max-w-6xl mx-auto px-4 pb-12">
      <header className="py-4 border-b-2 border-black flex flex-wrap items-baseline gap-4">
        <Link href="/" className="underline text-[13px] font-bold uppercase" style={{ color: "var(--brutal-blue)" }}>
          ← BRUTAL UX
        </Link>
        <h1 className="text-[24px] font-bold uppercase">STARKTEXT — WORDS OVER EVERYTHING</h1>
      </header>

      {!posts ? (
        <p className="py-8 text-[13px] font-bold uppercase">LOADING.</p>
      ) : mode === "INDEX" ? (
        <>
          <div className="brutal-border p-3 my-6">
            <p className="text-[13px] font-bold uppercase">
              NO LIKES. NO COMMENTS. NO ALGORITHM. NO TRACKING. WORDS DELIVERED VIA HTTP.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="brutal-btn text-[13px]" onClick={createPost}>
              NEW POST
            </button>
            <button
              type="button"
              className="brutal-btn text-[13px]"
              onClick={() => download("feed.xml", "application/rss+xml", buildRss(posts))}
            >
              EXPORT RSS
            </button>
          </div>

          <div className="brutal-divider my-6" />

          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className={TH}>TITLE</th>
                <th className={TH}>SLUG</th>
                <th className={TH}>STATUS</th>
                <th className={TH}>UPDATED</th>
                <th className={TH}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td className={TD} colSpan={5}>
                    NO POSTS. WRITE ONE.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id}>
                    <td className={`${TD} font-bold uppercase`}>{p.title || "UNTITLED"}</td>
                    <td className={TD}>{p.slug}</td>
                    <td className={`${TD} font-bold`}>{p.status}</td>
                    <td className={TD}>{p.updated.slice(0, 16).replace("T", " ")}</td>
                    <td className={TD}>
                      <span className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          className={ROW_ACTION}
                          style={{ color: "var(--brutal-blue)" }}
                          onClick={() => setView({ kind: "EDITOR", id: p.id })}
                        >
                          EDIT
                        </button>
                        {p.status === "PUBLISHED" && (
                          <button
                            type="button"
                            className={ROW_ACTION}
                            style={{ color: "var(--brutal-blue)" }}
                            onClick={() => setView({ kind: "READER", id: p.id })}
                          >
                            READ
                          </button>
                        )}
                        <button type="button" className={ROW_ACTION} onClick={() => deletePost(p.id)}>
                          DELETE
                        </button>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <p className="mt-4 text-[13px] font-bold uppercase">
            {posts.length} POSTS. {posts.filter((p) => p.status === "PUBLISHED").length} PUBLISHED.
          </p>
        </>
      ) : mode === "EDITOR" && active ? (
        <>
          <div className="my-6 flex flex-wrap items-center gap-3">
            <button type="button" className="brutal-btn text-[13px]" onClick={() => setView({ kind: "INDEX" })}>
              BACK
            </button>
            <button
              type="button"
              className="brutal-btn text-[13px]"
              onClick={() => {
                updatePost(active.id, { status: "PUBLISHED", published: active.published ?? nowISO() })
                setView({ kind: "INDEX" })
              }}
            >
              PUBLISH
            </button>
            <button type="button" className="brutal-btn text-[13px]" onClick={() => deletePost(active.id)}>
              DELETE
            </button>
            <span className="text-[11px] font-bold uppercase">
              STATUS: {active.status}. AUTOSAVED. THERE IS NO SAVE BUTTON.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-[13px] font-bold uppercase mb-2">TITLE</span>
              <input
                className="brutal-input w-full text-[16px] font-bold uppercase"
                value={active.title}
                onChange={(e) =>
                  updatePost(active.id, { title: e.target.value, slug: slugify(e.target.value) || "untitled" })
                }
                spellCheck={false}
              />
            </label>
            <label className="block">
              <span className="block text-[13px] font-bold uppercase mb-2">SLUG — AUTO-DERIVED. EDITABLE.</span>
              <input
                className="brutal-input w-full text-[16px]"
                value={active.slug}
                onChange={(e) =>
                  updatePost(active.id, { slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })
                }
                onBlur={() => updatePost(active.id, { slug: slugify(active.slug) || "untitled" })}
                spellCheck={false}
              />
            </label>
          </div>

          <div className="brutal-divider my-6" />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-[13px] font-bold uppercase mb-2">INPUT — RAW MARKDOWN</h2>
              <textarea
                className="brutal-input w-full min-h-[60vh] font-mono text-[13px] resize-y"
                value={active.markdown}
                onChange={(e) => updatePost(active.id, { markdown: e.target.value })}
                spellCheck={false}
              />
            </div>
            <div>
              <h2 className="text-[13px] font-bold uppercase mb-2">OUTPUT — COMPILED. INSTANTLY.</h2>
              <div
                className="brutal-border p-4 min-h-[60vh] starktext-preview text-[16px] leading-snug"
                dangerouslySetInnerHTML={{ __html: compileMarkdown(active.markdown) }}
              />
            </div>
          </section>
        </>
      ) : mode === "READER" && active ? (
        <>
          <div className="my-6 flex flex-wrap gap-3">
            <button type="button" className="brutal-btn text-[13px]" onClick={() => setView({ kind: "INDEX" })}>
              BACK
            </button>
            <button
              type="button"
              className="brutal-btn text-[13px]"
              onClick={() => download(`${active.slug}.html`, "text/html", buildStandaloneHtml(active))}
            >
              EXPORT HTML
            </button>
          </div>

          <div className="brutal-divider mb-8" />

          <article
            className="starktext-preview mx-auto max-w-[72ch] text-[16px] leading-snug"
            dangerouslySetInnerHTML={{
              __html:
                `<h1>${escapeHtml(active.title || "UNTITLED")}</h1>` +
                `<p><strong>PUBLISHED ${(active.published ?? active.updated).slice(0, 10)}</strong></p>` +
                compileMarkdown(active.markdown),
            }}
          />

          <footer className="mx-auto max-w-[72ch] mt-8">
            <div className="brutal-divider mb-4" />
            <p className="text-[13px] font-bold uppercase">PUBLISHED ON STARKTEXT. NO TRACKING. VIEW SOURCE.</p>
          </footer>
        </>
      ) : null}

      <style>{`
        .starktext-preview h1 { font-size: 32px; font-weight: 700; text-transform: uppercase; margin: 0 0 12px; }
        .starktext-preview h2 { font-size: 24px; font-weight: 700; text-transform: uppercase; margin: 16px 0 8px; }
        .starktext-preview h3 { font-size: 16px; font-weight: 700; text-transform: uppercase; margin: 12px 0 6px; }
        .starktext-preview p { margin: 0 0 12px; }
        .starktext-preview ul { list-style: square; padding-left: 24px; margin: 0 0 12px; }
        .starktext-preview blockquote { border-left: 4px solid var(--brutal-black); padding-left: 12px; font-weight: 700; margin: 0 0 12px; }
        .starktext-preview pre { border: 2px solid var(--brutal-black); background: var(--brutal-black); color: var(--brutal-green); padding: 12px; overflow-x: auto; margin: 0 0 12px; }
        .starktext-preview code { font-weight: 700; }
        .starktext-preview p code, .starktext-preview li code { background: var(--brutal-black); color: var(--brutal-green); padding: 0 4px; }
        .starktext-preview a { color: var(--brutal-blue); text-decoration: underline; }
      `}</style>
    </main>
  )
}
