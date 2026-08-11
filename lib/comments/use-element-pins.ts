"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { toApiStrict } from "@/lib/comments/config"
import { deriveTerm } from "@/lib/comments/derive-term"
import { parseMarker } from "@/lib/comments/marker"

interface UseElementPinsOptions {
  giscusHost: string
  repo: string
  category: string
  strict: boolean
}

interface UseElementPinsResult {
  pinCounts: Map<string, number>
  discussionMissing: boolean
  isLoading: boolean
  refetch: () => Promise<void>
}

// Fetches the fork's REST discussions-read endpoint once per route (term is
// derived from the current pathname) and scans top-level comment bodies for
// the pin marker — mirrors CLICK_TO_COMMENT_SPEC.md §4.
export function useElementPins({
  giscusHost,
  repo,
  category,
  strict,
}: UseElementPinsOptions): UseElementPinsResult {
  const pathname = usePathname()
  const term = deriveTerm(pathname)

  const [pinCounts, setPinCounts] = React.useState<Map<string, number>>(new Map())
  const [discussionMissing, setDiscussionMissing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchPins = React.useCallback(async () => {
    setIsLoading(true)
    const params = new URLSearchParams({
      repo,
      term,
      category,
      strict: toApiStrict(strict),
      last: "100",
    })

    try {
      const res = await fetch(`${giscusHost}/api/discussions?${params.toString()}`)

      if (res.status === 404) {
        setPinCounts(new Map())
        setDiscussionMissing(true)
        return
      }
      if (!res.ok) {
        setPinCounts(new Map())
        setDiscussionMissing(false)
        return
      }

      const json: { discussion?: { comments?: Array<{ body: string }> } } = await res.json()
      const comments = json.discussion?.comments ?? []
      const counts = new Map<string, number>()
      for (const comment of comments) {
        const elementId = parseMarker(comment.body ?? "")
        if (!elementId) continue
        counts.set(elementId, (counts.get(elementId) ?? 0) + 1)
      }
      setPinCounts(counts)
      setDiscussionMissing(false)
    } catch {
      setPinCounts(new Map())
      setDiscussionMissing(false)
    } finally {
      setIsLoading(false)
    }
  }, [giscusHost, repo, term, category, strict])

  React.useEffect(() => {
    fetchPins()
  }, [fetchPins])

  return { pinCounts, discussionMissing, isLoading, refetch: fetchPins }
}
