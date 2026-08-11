// Mirrors the fork's client.ts exactly (mapping="pathname"): strips the
// leading slash, strips a trailing .ext-shaped suffix, and maps "/" to the
// literal string "index". Every consumer of `term` must go through this —
// next/navigation's usePathname() alone resolves a different Discussion than
// the one the page's embedded <Giscus> widget already uses.
export function deriveTerm(pathname: string): string {
  return pathname.length < 2 ? "index" : pathname.substring(1).replace(/\.\w+$/, "")
}
