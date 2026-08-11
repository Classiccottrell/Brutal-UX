// Single source for giscus config — both components/comments.tsx and the
// pin-data provider import from here instead of duplicating placeholders.
export const COMMENTS_CONFIG = {
  giscusHost: "https://giscus-brutal-fork-cyan.vercel.app",
  repo: "Classiccottrell/Brutal-UX",
  repoId: "R_kgDOTUFCNQ",
  category: "Comments",
  categoryId: "DIC_kwDOTUFCNc4DDKPj",
  strict: false,
} as const

// Verified against the fork's actual source (not assumed): the REST
// discussions-read endpoint and the widget/pin-widget iframe encode `strict`
// differently. Never share one `.toString()` between them.
export function toApiStrict(strict: boolean): string {
  return String(strict) // "true" | "false" — pages/api/discussions/index.ts
}

export function toWidgetStrict(strict: boolean): string {
  return strict ? "1" : "0" // pages/widget.tsx / pages/pin-widget.tsx
}
