"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type Node = { id: string; cpu: number; mem: number; critical: boolean; severed: boolean }
type LogRow = { id: number; time: string; text: string; level: "INFO" | "CRIT" }

const INITIAL_NODES: Node[] = ["NODE-01", "NODE-02", "NODE-03", "NODE-04"].map((id) => ({
  id,
  cpu: 20,
  mem: 30,
  critical: false,
  severed: false,
}))

const MESSAGES = [
  "PACKET STORM ABSORBED",
  "DISK SECTOR REMAPPED",
  "THREAD POOL SATURATED",
  "CACHE PURGED WITHOUT MERCY",
  "HEARTBEAT RECEIVED",
  "SWAP THRASHING DETECTED",
  "CONNECTION REFUSED. GOOD.",
  "GC PAUSE 0MS. AS DEMANDED.",
]

let logId = 1

function stamp() {
  return new Date().toISOString().slice(11, 19)
}

export default function TerminalRed() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)
  const [logs, setLogs] = useState<LogRow[]>([])
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes

  function pushLog(text: string, level: "INFO" | "CRIT" = "INFO") {
    setLogs((prev) => [{ id: logId++, time: stamp(), text, level }, ...prev].slice(0, 50))
  }

  // Metric jumps: instant value swaps, no tween.
  useEffect(() => {
    const t = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.severed) return n
          const cpu = Math.floor(Math.random() * 100)
          const mem = Math.floor(Math.random() * 100)
          return { ...n, cpu, mem, critical: cpu > 85 || mem > 90 }
        })
      )
    }, 1200)
    return () => clearInterval(t)
  }, [])

  // Log stream.
  useEffect(() => {
    const t = setInterval(() => {
      const live = nodesRef.current.filter((n) => !n.severed)
      const node = live.length
        ? live[Math.floor(Math.random() * live.length)]
        : { id: "SYSTEM" }
      const crit = nodesRef.current.some((n) => n.critical && !n.severed)
      pushLog(
        `${node.id} :: ${MESSAGES[Math.floor(Math.random() * MESSAGES.length)]}`,
        crit && Math.random() > 0.6 ? "CRIT" : "INFO"
      )
    }, 800)
    return () => clearInterval(t)
  }, [])

  function kill(id: string) {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, severed: true, critical: false } : n))
    )
    pushLog(`${id} :: SEVERED BY OPERATOR. NO CONFIRMATION REQUESTED.`, "CRIT")
  }

  const anyCritical = nodes.some((n) => n.critical && !n.severed)

  return (
    <main
      className="min-h-screen px-4 pb-8 max-w-6xl mx-auto"
      style={{ background: "var(--brutal-black)", color: "var(--brutal-white)" }}
    >
      <div style={{ background: "var(--brutal-black)" }} className="fixed inset-0 -z-10" />

      <header className="py-4 flex items-baseline gap-4" style={{ borderBottom: "2px solid var(--brutal-white)" }}>
        <Link href="/" className="underline text-[13px] font-bold uppercase" style={{ color: "var(--brutal-green)" }}>
          ← BRUTAL UX
        </Link>
        <h1 className="text-[24px] font-bold uppercase">TERMINAL RED — INCIDENT COMMAND</h1>
      </header>

      {anyCritical && (
        <div className="brutal-alert w-full py-2 px-4 mt-4 font-bold uppercase text-center">
          CRITICAL NODE DETECTED. ACT OR WATCH IT BURN.
        </div>
      )}

      <section className="py-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {nodes.map((n) => (
          <div key={n.id} className="p-4" style={{ border: "2px solid var(--brutal-white)" }}>
            <h2 className="text-[16px] font-bold uppercase mb-3" style={{ borderBottom: "2px solid var(--brutal-white)", paddingBottom: 8 }}>
              {n.id}
            </h2>
            {n.severed ? (
              <p className="text-[32px] font-bold uppercase" style={{ color: "var(--brutal-red)" }}>
                SEVERED
              </p>
            ) : (
              <>
                <p className="text-[13px] font-bold uppercase">
                  CPU{" "}
                  <span style={{ color: "var(--brutal-green)" }} className="text-[24px]">
                    {n.cpu}%
                  </span>
                </p>
                <p className="text-[13px] font-bold uppercase">
                  MEM{" "}
                  <span style={{ color: "var(--brutal-green)" }} className="text-[24px]">
                    {n.mem}%
                  </span>
                </p>
                <p className="text-[13px] font-bold uppercase my-2">
                  STATUS:{" "}
                  {n.critical ? (
                    <span className="brutal-alert px-2">CRITICAL</span>
                  ) : (
                    <span style={{ color: "var(--brutal-green)" }}>OK</span>
                  )}
                </p>
                <button
                  className="w-full font-bold uppercase py-2"
                  style={{
                    border: "2px solid var(--brutal-red)",
                    background: "var(--brutal-black)",
                    color: "var(--brutal-red)",
                  }}
                  onClick={() => kill(n.id)}
                >
                  KILL NODE
                </button>
              </>
            )}
          </div>
        ))}
      </section>

      <section className="py-6" style={{ borderTop: "3px solid var(--brutal-white)" }}>
        <h2 className="text-[16px] font-bold uppercase mb-3">LOG STREAM — NEWEST FIRST — LAST 50</h2>
        <table className="w-full border-collapse text-[13px]" style={{ border: "2px solid var(--brutal-white)" }}>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td className="p-2 font-bold uppercase" style={{ border: "2px solid var(--brutal-white)", color: "var(--brutal-green)" }}>
                  AWAITING TELEMETRY.
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id}>
                  <td
                    className="p-1 px-2 w-24"
                    style={{ border: "2px solid var(--brutal-white)", color: "var(--brutal-green)" }}
                  >
                    {l.time}
                  </td>
                  <td
                    className="p-1 px-2 font-bold"
                    style={{
                      border: "2px solid var(--brutal-white)",
                      color: l.level === "CRIT" ? "var(--brutal-red)" : "var(--brutal-green)",
                    }}
                  >
                    {l.text}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}
