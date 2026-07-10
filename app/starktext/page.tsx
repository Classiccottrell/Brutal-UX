"use client"

import Link from "next/link"
import { useState } from "react"

const SAMPLE = `# STARKTEXT

Words arrive. Words render. Nothing else happens.

## THE DEAL

You write **plain text**. The machine compiles it *instantly*. There is no \`draft autosave spinner\`.

- No likes
- No comments
- No algorithm

> Decoration is a tax on reading. This page refuses to collect it.

\`\`\`
POST /words HTTP/1.1
Content-Type: text/plain

THE END.
\`\`\`

Read the [manifesto](/) again if you forget.`

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function inline(s: string): string {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

function compile(md: string): string {
  const lines = md.split("\n")
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith("```")) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(esc(lines[i]))
        i++
      }
      i++ // closing fence
      out.push(`<pre><code>${code.join("\n")}</code></pre>`)
      continue
    }
    if (/^###\s/.test(line)) { out.push(`<h3>${inline(line.slice(4))}</h3>`); i++; continue }
    if (/^##\s/.test(line)) { out.push(`<h2>${inline(line.slice(3))}</h2>`); i++; continue }
    if (/^#\s/.test(line)) { out.push(`<h1>${inline(line.slice(2))}</h1>`); i++; continue }
    if (/^>\s?/.test(line)) {
      const quote: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(inline(lines[i].replace(/^>\s?/, "")))
        i++
      }
      out.push(`<blockquote><p>${quote.join(" ")}</p></blockquote>`)
      continue
    }
    if (/^[-*]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].slice(2))}</li>`)
        i++
      }
      out.push(`<ul>${items.join("")}</ul>`)
      continue
    }
    if (line.trim() === "") { i++; continue }
    const para: string[] = [line]
    i++
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,3}\s|>|```|[-*]\s)/.test(lines[i])) {
      para.push(lines[i])
      i++
    }
    out.push(`<p>${inline(para.join(" "))}</p>`)
  }
  return out.join("\n")
}

export default function StarkText() {
  const [text, setText] = useState(SAMPLE)

  return (
    <main className="bg-white text-black max-w-6xl mx-auto px-4">
      <header className="py-4 border-b-2 border-black flex items-baseline gap-4">
        <Link href="/" className="underline text-[13px] font-bold uppercase" style={{ color: "var(--brutal-blue)" }}>
          ← BRUTAL UX
        </Link>
        <h1 className="text-[24px] font-bold uppercase">STARKTEXT — WORDS OVER EVERYTHING</h1>
      </header>

      <div className="brutal-border p-3 my-6">
        <p className="text-[13px] font-bold uppercase">
          NO LIKES. NO COMMENTS. NO ALGORITHM. NO TRACKING. WORDS DELIVERED VIA HTTP.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
        <div>
          <h2 className="text-[13px] font-bold uppercase mb-2">INPUT — RAW MARKDOWN</h2>
          <textarea
            className="brutal-input w-full min-h-[60vh] font-mono text-[13px] resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div>
          <h2 className="text-[13px] font-bold uppercase mb-2">OUTPUT — COMPILED. INSTANTLY.</h2>
          <div
            className="brutal-border p-4 min-h-[60vh] starktext-preview text-[16px] leading-snug"
            dangerouslySetInnerHTML={{ __html: compile(text) }}
          />
        </div>
      </section>

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
