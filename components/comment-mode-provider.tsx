"use client"

import * as React from "react"

import { buildPositionId } from "@/lib/comments/position-id"

type CommentModeContextValue = {
  isCommentMode: boolean
  toggleCommentMode: () => void
  openElementId: string | null
  anchorRect: DOMRect | null
  openPin: (id: string, rect: DOMRect) => void
  closePin: () => void
}

const CommentModeContext = React.createContext<CommentModeContextValue | null>(null)

function CommentModeProvider({ children }: { children: React.ReactNode }) {
  const [isCommentMode, setIsCommentMode] = React.useState(false)
  const [openElementId, setOpenElementId] = React.useState<string | null>(null)
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null)

  const toggleCommentMode = React.useCallback(() => {
    setIsCommentMode((current) => !current)
  }, [])

  const openPin = React.useCallback((id: string, rect: DOMRect) => {
    setOpenElementId(id)
    setAnchorRect(rect)
  }, [])

  const closePin = React.useCallback(() => {
    setOpenElementId(null)
    setAnchorRect(null)
  }, [])

  // Global trigger: Alt+Click anywhere inside <main>, while Comment Mode is
  // on, drops a pin at that position. Capture phase + preventDefault so it
  // never reaches the clicked element's own handlers (or the browser's
  // native alt-click-to-download-link behavior).
  React.useEffect(() => {
    if (!isCommentMode) return

    function handleClick(event: MouseEvent) {
      if (!event.altKey) return

      const main = document.querySelector("main")
      if (!main) return

      const rect = main.getBoundingClientRect()
      const xPct = (event.clientX - rect.left) / rect.width
      const yPct = (event.clientY - rect.top) / rect.height
      if (xPct < 0 || xPct > 1 || yPct < 0 || yPct > 1) return

      event.preventDefault()
      event.stopPropagation()

      const id = buildPositionId(xPct, yPct)
      setOpenElementId(id)
      setAnchorRect(new DOMRect(event.clientX, event.clientY, 0, 0))
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [isCommentMode])

  const value = React.useMemo(
    () => ({ isCommentMode, toggleCommentMode, openElementId, anchorRect, openPin, closePin }),
    [isCommentMode, toggleCommentMode, openElementId, anchorRect, openPin, closePin]
  )

  return (
    <CommentModeContext.Provider value={value}>
      {children}
    </CommentModeContext.Provider>
  )
}

function useCommentMode() {
  const ctx = React.useContext(CommentModeContext)
  if (!ctx) {
    throw new Error("useCommentMode must be used within a CommentModeProvider")
  }
  return ctx
}

export { CommentModeProvider, useCommentMode }
