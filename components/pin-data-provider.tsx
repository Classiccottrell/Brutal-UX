"use client"

import * as React from "react"

import { useElementPins } from "@/lib/comments/use-element-pins"

type PinDataContextValue = {
  pinCounts: Map<string, number>
  discussionMissing: boolean
  isLoading: boolean
  refetch: () => Promise<void>
}

const PinDataContext = React.createContext<PinDataContextValue | null>(null)

type PinDataProviderProps = {
  giscusHost: string
  repo: string
  category: string
  strict: boolean
  children: React.ReactNode
}

// Hoists the single per-route pin fetch to one place in the tree. Next.js
// page.tsx files are Server Components and can't call hooks directly — this
// lets the canvas pin layer render on every page with zero data-fetching wiring
// of its own.
function PinDataProvider({ giscusHost, repo, category, strict, children }: PinDataProviderProps) {
  const value = useElementPins({ giscusHost, repo, category, strict })

  return (
    <PinDataContext.Provider value={value}>
      {children}
    </PinDataContext.Provider>
  )
}

function usePinData() {
  const ctx = React.useContext(PinDataContext)
  if (!ctx) {
    throw new Error("usePinData must be used within a PinDataProvider")
  }
  return ctx
}

export { PinDataProvider, usePinData }
