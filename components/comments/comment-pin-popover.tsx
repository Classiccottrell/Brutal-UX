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
      className="brutal-border fixed z-50 bg-white"
      style={{ top: anchorRect.bottom + 8, left: anchorRect.left, width: 340, maxHeight: 480 }}
    >
      <div className="flex items-center justify-between border-b-2 border-black px-2 py-1">
        <span className="text-[13px] font-bold uppercase">COMMENT</span>
        <button
          type="button"
          onClick={onClose}
          className="text-[13px] font-bold"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <iframe
        src={src}
        title="giscus pin comments"
        className="w-full"
        style={{ height: 420, border: "none" }}
      />
    </div>
  )
}
