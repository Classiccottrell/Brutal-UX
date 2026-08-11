"use client"

import { useCommentMode } from "@/components/comment-mode-provider"
import { CommentPinPopover } from "@/components/comments/comment-pin-popover"
import { usePinData } from "@/components/pin-data-provider"
import { COMMENTS_CONFIG } from "@/lib/comments/config"

// Renders the active popover at layout level so it isn't clipped by any
// screen-local overflow.
export function CommentPinPopoverHost() {
  const { openElementId, anchorRect, closePin } = useCommentMode()
  const { refetch } = usePinData()

  if (!openElementId || !anchorRect) {
    return null
  }

  return (
    <CommentPinPopover
      elementId={openElementId}
      anchorRect={anchorRect}
      giscusHost={COMMENTS_CONFIG.giscusHost}
      repo={COMMENTS_CONFIG.repo}
      repoId={COMMENTS_CONFIG.repoId}
      category={COMMENTS_CONFIG.category}
      categoryId={COMMENTS_CONFIG.categoryId}
      strict={COMMENTS_CONFIG.strict}
      theme="mineral"
      onClose={() => {
        closePin()
        refetch()
      }}
    />
  )
}
