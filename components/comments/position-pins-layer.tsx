"use client"

import { useCommentMode } from "@/components/comment-mode-provider"
import { usePinData } from "@/components/pin-data-provider"
import { parsePositionId } from "@/lib/comments/position-id"

// Mounted once inside each page's <main> (which must be position: relative
// so these percentage-based badges anchor to it, not the viewport — that's
// what makes this scroll- and resize-safe without any JS rect tracking).
// Pins only render while Comment Mode is on, to keep the page clutter-free
// for normal visitors — unlike the old per-element PinBadge, which was
// always visible.
export function PositionPinsLayer() {
  const { isCommentMode, openPin } = useCommentMode()
  const { pinCounts } = usePinData()

  if (!isCommentMode) {
    return null
  }

  return (
    <div className="absolute inset-0 z-10" style={{ pointerEvents: "none" }}>
      {Array.from(pinCounts.entries()).map(([id, count]) => {
        const position = parsePositionId(id)
        if (!position) return null

        return (
          <button
            key={id}
            type="button"
            style={{
              position: "absolute",
              left: `${position.xPct * 100}%`,
              top: `${position.yPct * 100}%`,
              pointerEvents: "auto",
              transform: "translate(-50%, -50%)",
            }}
            className="flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-black bg-white px-1 text-[11px] font-bold text-black"
            onClick={(event) => {
              event.stopPropagation()
              openPin(id, new DOMRect(event.clientX, event.clientY, 0, 0))
            }}
            title={`${count} comment${count === 1 ? "" : "s"} at this position`}
          >
            {count}
          </button>
        )
      })}
    </div>
  )
}
