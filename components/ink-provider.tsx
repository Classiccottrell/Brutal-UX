"use client"

import * as React from "react"

import { isTypingTarget } from "@/lib/utils"

type Ink = "black" | "cobalt"

const STORAGE_KEY = "brutal-ink"

type InkContextValue = {
  ink: Ink
  setInk: (ink: Ink) => void
  toggleInk: () => void
}

const InkContext = React.createContext<InkContextValue | null>(null)

function InkProvider({ children }: { children: React.ReactNode }) {
  const [ink, setInkState] = React.useState<Ink>("black")
  const [mounted, setMounted] = React.useState(false)

  // The blocking script in the document <head> already painted the stored
  // ink before hydration. This effect only brings React state in sync with
  // it — it must not write to the DOM/localStorage before it has read the
  // real stored value, or it would flash the page back to "black" first.
  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    setInkState(stored === "cobalt" ? "cobalt" : "black")
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) {
      return
    }
    document.documentElement.dataset.ink = ink
    window.localStorage.setItem(STORAGE_KEY, ink)
  }, [ink, mounted])

  const setInk = React.useCallback((next: Ink) => {
    setInkState(next)
  }, [])

  const toggleInk = React.useCallback(() => {
    setInkState((current) => (current === "black" ? "cobalt" : "black"))
  }, [])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "c") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      toggleInk()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [toggleInk])

  const value = React.useMemo(
    () => ({ ink, setInk, toggleInk }),
    [ink, setInk, toggleInk]
  )

  return <InkContext.Provider value={value}>{children}</InkContext.Provider>
}

function useInk() {
  const ctx = React.useContext(InkContext)
  if (!ctx) {
    throw new Error("useInk must be used within an InkProvider")
  }
  return ctx
}

export { InkProvider, useInk }
export type { Ink }
