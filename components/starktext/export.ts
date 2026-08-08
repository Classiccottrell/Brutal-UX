// StarkText export: RSS feed and standalone HTML. Pure string builders —
// no DOM, no localStorage. The page owns the Blob/anchor download mechanics.

import { compileMarkdown, escapeHtml } from "./markdown.ts"

export type Post = {
  id: string
  slug: string
  title: string
  markdown: string
  status: "DRAFT" | "PUBLISHED"
  created: string
  updated: string
  published?: string
}

const FEED_ORIGIN = "https://starktext.example"

// Compiled HTML -> plain text (compiler only ever emits these 5 entities).
export function stripTags(html: string): string {
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

export function buildRss(posts: Post[]): string {
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

export function buildStandaloneHtml(post: Post): string {
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
