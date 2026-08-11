"use client"

import Giscus from "@giscus/react"

import { COMMENTS_CONFIG } from "@/lib/comments/config"

// Deliberately not synced to next-themes — keep giscus's own default
// ("preferred_color_scheme") so the widget renders with its stock styling,
// visually distinct from the Brutal UX theme, while this is being wired up.
export function Comments() {
  return (
    <Giscus
      host={COMMENTS_CONFIG.giscusHost}
      repo={COMMENTS_CONFIG.repo}
      repoId={COMMENTS_CONFIG.repoId}
      category={COMMENTS_CONFIG.category}
      categoryId={COMMENTS_CONFIG.categoryId}
      mapping="pathname"
      strict={COMMENTS_CONFIG.strict ? "1" : "0"}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="mineral"
      lang="en"
      loading="lazy"
    />
  )
}
