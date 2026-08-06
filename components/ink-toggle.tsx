"use client"

import { useInk } from "@/components/ink-provider"

export function InkToggle() {
  const { ink, toggleInk } = useInk()
  const next = ink === "black" ? "COBALT" : "BLACK"

  return (
    <button
      type="button"
      onClick={toggleInk}
      className="brutal-btn fixed bottom-4 right-4 z-50 text-[13px]"
      title="Swap the primary ink. Hotkey: C"
    >
      INK/{ink.toUpperCase()} → {next}
    </button>
  )
}
