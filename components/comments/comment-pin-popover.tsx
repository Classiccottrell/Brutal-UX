"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { toWidgetStrict } from "@/lib/comments/config"
import { deriveTerm } from "@/lib/comments/derive-term"

interface CommentPinPopoverProps {
  elementId: string
  anchorRect: DOMRect
  giscusHost: string
  repo: string
  repoId: string
  category: string
  categoryId: string
  strict: boolean
  theme: string
  onClose: () => void
}

function readGiscusSession(): string {
  try {
    return JSON.parse(window.localStorage.getItem("giscus-session") || '""')
  } catch {
    return ""
  }
}

const MIN_IFRAME_HEIGHT = 160
const MAX_IFRAME_HEIGHT = 440 // popover max-height (480) minus the header row

// Reads the session the fork's client.ts already wrote to this origin's
// localStorage (page-level widget auth handoff) and opens a compact iframe
// onto the fork's pin-widget page — no separate OAuth flow.
export function CommentPinPopover({
  elementId,
  anchorRect,
  giscusHost,
  repo,
  repoId,
  category,
  categoryId,
  strict,
  theme,
  onClose,
}: CommentPinPopoverProps) {
  const pathname = usePathname()
  const term = deriveTerm(pathname)
  const popoverRef = React.useRef<HTMLDivElement>(null)
  const [iframeHeight, setIframeHeight] = React.useState(MIN_IFRAME_HEIGHT)

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    function handleClick(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    // Delay attaching so the click that opened this popover doesn't
    // immediately count as an "outside click" and close it.
    const timeoutId = window.setTimeout(() => {
      window.addEventListener("mousedown", handleClick)
    }, 0)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousedown", handleClick)
      window.clearTimeout(timeoutId)
    }
  }, [onClose])

  // pin-widget.tsx (fork) reports its actual content height via postMessage
  // — a cross-origin iframe's content can't be measured directly. Clamped
  // to MAX_IFRAME_HEIGHT; content taller than that scrolls inside the
  // iframe itself (the browser's own default for a height-constrained
  // iframe), no extra CSS needed here.
  React.useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== giscusHost) return
      const resizeHeight = event.data?.giscus?.resizeHeight
      if (typeof resizeHeight !== "number") return
      setIframeHeight(Math.max(MIN_IFRAME_HEIGHT, Math.min(resizeHeight, MAX_IFRAME_HEIGHT)))
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [giscusHost])

  const session = React.useMemo(() => readGiscusSession(), [])
  const src = React.useMemo(() => {
    const params = new URLSearchParams({
      session,
      origin: window.location.href,
      repo,
      repoId,
      category,
      categoryId,
      strict: toWidgetStrict(strict),
      term,
      elementId,
      theme,
    })
    return `${giscusHost}/pin-widget?${params.toString()}`
  }, [session, repo, repoId, category, categoryId, strict, term, elementId, theme, giscusHost])

  return (
    <div
      ref={popoverRef}
      className="mineral-popover fixed z-50"
      style={{ top: anchorRect.bottom + 8, left: anchorRect.left, width: 340 }}
    >
      <div className="mineral-popover-header flex items-center justify-between px-3 py-2">
        <span className="text-[13px] font-bold uppercase">Comment</span>
        <button
          type="button"
          onClick={onClose}
          className="text-[15px] font-bold leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <iframe
        src={src}
        title="giscus pin comments"
        className="block w-full"
        style={{ height: iframeHeight, border: "none" }}
      />
    </div>
  )
}
