// StarkText markdown compiler. Pure functions, zero dependencies.
// Grammar: h1-h3, **bold**, *italic*, `inline code`, [links](url),
// unordered lists, blockquotes, fenced code blocks, paragraphs.
// Raw HTML in source is escaped BEFORE markdown rules run — the only tags
// in the output are the ones this compiler emits. No script injection.

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Reject javascript:/data:/etc. Allow http(s), mailto, relative, anchor.
const SAFE_HREF = /^(https?:\/\/|mailto:|\/|\.\/|\.\.\/|#)/i

function inline(s: string): string {
  // NUL delimits code-span placeholders below; strip it from input so user
  // text can never forge a placeholder.
  let out = escapeHtml(s.replace(/\u0000/g, ""))
  // Lift code spans into placeholders so bold/italic/link rules
  // cannot rewrite their contents.
  const codeSpans: string[] = []
  out = out.replace(/`([^`]+)`/g, (_m, code: string) => {
    codeSpans.push(`<code>${code}</code>`)
    return `\u0000${codeSpans.length - 1}\u0000`
  })
  out = out
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^()\s]+)\)/g, (_m, text: string, href: string) =>
      SAFE_HREF.test(href) ? `<a href="${href}">${text}</a>` : text
    )
  return out.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => codeSpans[Number(i)])
}

export function compileMarkdown(src: string): string {
  const lines = src.split("\n")
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith("```")) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(escapeHtml(lines[i]))
        i++
      }
      i++ // closing fence (or EOF)
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

// Lowercase, a-z0-9 and hyphens only, collapse repeats, trim edge hyphens.
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
