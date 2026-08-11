// Cross-repo string contract (CLICK_TO_COMMENT_SPEC.md §6) — must match the
// fork's PIN_MARKER_RE in components/PinThread.tsx exactly. No shared import
// is possible across the two codebases.
const PIN_MARKER_RE = /^<!--\s*pin:\s*data-comment-id="([^"]+)"\s*-->/

export function buildMarker(elementId: string): string {
  return `<!-- pin: data-comment-id="${elementId}" -->`
}

export function parseMarker(body: string): string | null {
  const match = body.match(PIN_MARKER_RE)
  return match ? match[1] : null
}
