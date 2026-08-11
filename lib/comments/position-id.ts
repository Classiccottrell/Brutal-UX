// Position-based pin IDs: percentage of <main>'s content box, rounded to
// four decimal places and baked into the same opaque `data-comment-id`
// string the marker contract (marker.ts) already expects — no fork-side
// change needed, since PinThread only ever compares elementId by equality.
//
// Known tradeoff, deliberate for this POC: unlike a manually-named element
// id, a position drifts if content above it changes height (an insertion,
// a resize breakpoint change, a responsive reflow). A manual id fails loud
// (you'd have to rename it); a position fails silent (the pin just ends up
// pointing at the wrong spot). Acceptable for a demo; revisit before this
// goes any further than a POC.
const POSITION_ID_RE = /^pos-(\d+)-(\d+)$/

export function buildPositionId(xPct: number, yPct: number): string {
  const x = Math.round(Math.min(1, Math.max(0, xPct)) * 10000)
  const y = Math.round(Math.min(1, Math.max(0, yPct)) * 10000)
  return `pos-${x}-${y}`
}

export function parsePositionId(id: string): { xPct: number; yPct: number } | null {
  const match = id.match(POSITION_ID_RE)
  if (!match) return null
  return { xPct: Number(match[1]) / 10000, yPct: Number(match[2]) / 10000 }
}
