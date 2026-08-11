"use client"

import { useCommentMode } from "@/components/comment-mode-provider"

export function CommentModeToggle() {
  const { isCommentMode, toggleCommentMode } = useCommentMode()

  return (
    <>
      <button
        type="button"
        onClick={toggleCommentMode}
        className="brutal-btn fixed bottom-16 right-4 z-50 text-[13px]"
        title="Toggle Comment Mode — hold Alt and click anywhere on the page to pin a comment there"
        aria-pressed={isCommentMode}
      >
        COMMENT MODE/{isCommentMode ? "ON" : "OFF"}
      </button>
      {isCommentMode ? (
        <div className="brutal-border fixed bottom-16 right-48 z-50 bg-white px-2 py-1 text-[13px] font-bold uppercase">
          ALT+CLICK ANYWHERE TO COMMENT
        </div>
      ) : null}
    </>
  )
}
