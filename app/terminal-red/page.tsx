"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  NODE_DEFS,
  availableCommands,
  execCommand,
  initSim,
  ringPush,
  stepSim,
  type Command,
  type LogLevel,
  type NodeStatus,
  type SimNode,
  type SimState,
  type StepEvent,
} from "@/components/terminal-red/sim"

const TICK_MS = 700
const LOG_CAP = 100
const TL_CAP = 500
const TL_KEY = "terminalred.timeline.v1"
const EXEC_HOLD_MS = 3000 // EXECUTED marker holds, then the trigger row returns (instant swap)

const W = "var(--brutal-white)"
const G = "var(--brutal-green)"
const R = "var(--brutal-red)"

type LogRow = { id: number; ts: string; level: LogLevel; node: string; msg: string }
type TimelineType = "ALERT" | "COMMAND" | "RECOVERY"
type TimelineRow = { id: number; ts: string; type: TimelineType; node: string; detail: string }

const utcClock = (ms: number) => new Date(ms).toISOString().slice(11, 19)
const utcStamp = (ms: number) => new Date(ms).toISOString().slice(0, 19).replace("T", " ") + "Z"
const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}
const hhmmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((x) => String(x).padStart(2, "0"))
    .join(":")
}

const TRIGGERS: { cmd: Command; label: string; color: string }[] = [
  { cmd: "KILL", label: "KILL NODE", color: R },
  { cmd: "RESTART", label: "RESTART", color: G },
  { cmd: "DRAIN", label: "DRAIN", color: W },
]

function triggersFor(status: NodeStatus) {
  const allowed = new Set(availableCommands(status))
  return TRIGGERS.filter((t) => allowed.has(t.cmd))
}

function StripCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-2" style={{ border: `2px solid ${W}` }}>
      <div className="text-[10px] font-bold opacity-60">{label}</div>
      <div className="text-[18px] font-bold leading-tight" style={{ color }}>
        {value}
      </div>
    </div>
  )
}

export default function TerminalRed() {
  const [sim, setSim] = useState<SimState | null>(null)
  const [logs, setLogs] = useState<LogRow[]>([])
  const [timeline, setTimeline] = useState<TimelineRow[]>([])
  const [filter, setFilter] = useState("")
  const [nowMs, setNowMs] = useState<number | null>(null)
  const [executed, setExecuted] = useState<Record<string, { cmd: Command; at: number }>>({})

  const simRef = useRef<SimState | null>(null)
  const bootRef = useRef<number | null>(null)
  const incidentStartRef = useRef<number | null>(null)
  const tlLoadedRef = useRef(false)
  const logIdRef = useRef(1)
  const tlIdRef = useRef(1)

  const appendLogs = useCallback((rows: Omit<LogRow, "id">[]) => {
    if (!rows.length) return
    setLogs((prev) => rows.reduce((acc, r) => ringPush(acc, { ...r, id: logIdRef.current++ }, LOG_CAP), prev))
  }, [])

  const appendTimeline = useCallback((rows: Omit<TimelineRow, "id">[]) => {
    if (!rows.length) return
    setTimeline((prev) => rows.reduce((acc, r) => ringPush(acc, { ...r, id: tlIdRef.current++ }, TL_CAP), prev))
  }, [])

  const applyEvents = useCallback(
    (events: StepEvent[]) => {
      if (!events.length) return
      const at = Date.now()
      const ts = utcClock(at)
      const stamp = utcStamp(at)
      const logRows: Omit<LogRow, "id">[] = []
      const tlRows: Omit<TimelineRow, "id">[] = []
      for (const e of events) {
        switch (e.kind) {
          case "TRAFFIC":
            logRows.push({ ts, level: e.level, node: e.nodeId, msg: e.message })
            break
          case "INCIDENT_OPEN":
            incidentStartRef.current = at
            logRows.push({ ts, level: "ERROR", node: "SYSTEM", msg: `INCIDENT ${e.incidentId} OPENED` })
            tlRows.push({ ts: stamp, type: "ALERT", node: "SYSTEM", detail: `INCIDENT ${e.incidentId} OPENED` })
            break
          case "CRITICAL":
            logRows.push({ ts, level: "ERROR", node: e.nodeId, msg: `STATUS CRITICAL — CPU PEGGED — ${e.incidentId}` })
            tlRows.push({ ts: stamp, type: "ALERT", node: e.nodeId, detail: `NODE CRITICAL — ${e.incidentId}` })
            break
          case "RECOVERY":
            logRows.push({ ts, level: "INFO", node: e.nodeId, msg: "RESTORED TO OK" })
            tlRows.push({ ts: stamp, type: "RECOVERY", node: e.nodeId, detail: "NODE RESTORED TO OK" })
            break
          case "INCIDENT_CLOSE":
            incidentStartRef.current = null
            logRows.push({ ts, level: "INFO", node: "SYSTEM", msg: `INCIDENT ${e.incidentId} CLOSED` })
            tlRows.push({ ts: stamp, type: "RECOVERY", node: "SYSTEM", detail: `INCIDENT ${e.incidentId} CLOSED` })
            break
        }
      }
      appendLogs(logRows)
      appendTimeline(tlRows)
    },
    [appendLogs, appendTimeline]
  )

  // Boot: load persisted timeline, start the sim. Post-mount only (SSR renders the -- frame).
  useEffect(() => {
    bootRef.current = Date.now()
    let stored: TimelineRow[] = []
    try {
      const raw = localStorage.getItem(TL_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) stored = (parsed as TimelineRow[]).slice(0, TL_CAP)
      }
    } catch {
      // Corrupt store: start empty.
    }
    tlIdRef.current = stored.reduce((m, r) => Math.max(m, r?.id ?? 0), 0) + 1
    setTimeline(stored)
    tlLoadedRef.current = true
    const s = initSim(Math.random)
    simRef.current = s
    setSim(s)
    setNowMs(Date.now())
  }, [])

  // Persist timeline (only after the stored copy has been loaded).
  useEffect(() => {
    if (!tlLoadedRef.current) return
    try {
      localStorage.setItem(TL_KEY, JSON.stringify(timeline))
    } catch {
      // Storage full/blocked: keep running in-memory.
    }
  }, [timeline])

  // 700ms sim tick.
  useEffect(() => {
    const t = setInterval(() => {
      if (!simRef.current) return
      const next = stepSim(simRef.current, Math.random)
      simRef.current = next
      setSim(next)
      applyEvents(next.lastEvents)
    }, TICK_MS)
    return () => clearInterval(t)
  }, [applyEvents])

  // 1s wall clock: UTC time, uptime, incident elapsed; prunes EXECUTED markers.
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now()
      setNowMs(now)
      setExecuted((prev) => {
        const keep = Object.entries(prev).filter(([, v]) => now - v.at < EXEC_HOLD_MS)
        return keep.length === Object.keys(prev).length ? prev : Object.fromEntries(keep)
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  function runCommand(nodeId: string, cmd: Command) {
    const cur = simRef.current
    if (!cur) return
    const next = execCommand(cur, nodeId, cmd, Math.random)
    simRef.current = next
    setSim(next)
    const at = Date.now()
    appendLogs([{ ts: utcClock(at), level: "WARN", node: nodeId, msg: `EXECUTED ${cmd} → rc=0` }])
    appendTimeline([{ ts: utcStamp(at), type: "COMMAND", node: nodeId, detail: `${cmd} → rc=0` }])
    applyEvents(next.lastEvents)
    setExecuted((prev) => ({ ...prev, [nodeId]: { cmd, at } }))
  }

  function exportTimeline() {
    const blob = new Blob([JSON.stringify(timeline, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "terminal-red-timeline.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  function purgeTimeline() {
    setTimeline([])
    try {
      localStorage.removeItem(TL_KEY)
    } catch {
      // Ignore.
    }
  }

  const live = sim !== null
  const nodes: SimNode[] = live
    ? sim.nodes
    : NODE_DEFS.map((d) => ({ ...d, cpu: 0, mem: 0, disk: 0, reqRate: 0, status: "OK" as NodeStatus }))
  const okCount = live ? sim.nodes.filter((n) => n.status === "OK").length : null
  const critCount = live ? sim.nodes.filter((n) => n.status === "CRITICAL").length : 0
  const sevCount = live ? sim.nodes.filter((n) => n.status === "SEVERED").length : null
  const drainCount = live ? sim.nodes.filter((n) => n.status === "DRAINED").length : null

  const q = filter.trim().toUpperCase()
  const shownLogs = q
    ? logs.filter((l) => `${l.ts} ${l.level} ${l.node} ${l.msg}`.toUpperCase().includes(q))
    : logs

  const incidentActive = live && sim.incidentId !== null && critCount > 0
  const elapsed =
    incidentActive && nowMs !== null && incidentStartRef.current !== null
      ? mmss(nowMs - incidentStartRef.current)
      : "--:--"

  return (
    <main className="min-h-screen w-full px-3 pb-6 uppercase" style={{ background: "#000000", color: W }}>
      <div className="fixed inset-0 -z-10" style={{ background: "#000000" }} />

      <header className="flex items-baseline justify-between gap-4 py-2" style={{ borderBottom: `2px solid ${W}` }}>
        <h1 className="text-[20px] font-bold">TERMINAL RED — INCIDENT COMMAND</h1>
        <Link href="/" className="underline font-bold text-[12px]" style={{ color: W }}>
          ← INDEX
        </Link>
      </header>

      {/* STATUS STRIP */}
      <section className="grid grid-cols-3 md:grid-cols-6 gap-2 py-2">
        <StripCell label="UTC" value={nowMs !== null ? utcClock(nowMs) : "--:--:--"} color={G} />
        <StripCell
          label="UPTIME"
          value={nowMs !== null && bootRef.current !== null ? hhmmss(nowMs - bootRef.current) : "--:--:--"}
          color={G}
        />
        <StripCell label="NODES OK" value={okCount !== null ? String(okCount) : "--"} color={G} />
        <StripCell label="CRITICAL" value={live ? String(critCount) : "--"} color={critCount > 0 ? R : G} />
        <StripCell
          label="SEVERED"
          value={sevCount !== null ? String(sevCount) : "--"}
          color={(sevCount ?? 0) > 0 ? R : G}
        />
        <StripCell label="DRAINED" value={drainCount !== null ? String(drainCount) : "--"} color={G} />
      </section>

      {/* INCIDENT ALERT BAR */}
      {incidentActive && (
        <div className="brutal-alert w-full py-2 px-3 mb-2 font-bold text-center text-[15px]">
          INCIDENT {sim.incidentId} — {critCount} NODE(S) CRITICAL — ELAPSED {elapsed}
        </div>
      )}

      {/* NODE GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {nodes.map((n) => {
          const severed = n.status === "SEVERED"
          const noData = !live || severed
          const exec = executed[n.id]
          const metric = (v: number, pct: boolean) => ({
            text: noData ? "--" : String(v),
            color: noData ? W : pct && v >= 90 ? R : G,
          })
          const rows: { label: string; v: ReturnType<typeof metric> }[] = [
            { label: "CPU", v: metric(n.cpu, true) },
            { label: "MEM", v: metric(n.mem, true) },
            { label: "DISK", v: metric(n.disk, true) },
            { label: "REQ/S", v: metric(n.reqRate, false) },
          ]
          return (
            <div key={n.id} className="p-2" style={{ border: `2px solid ${W}` }}>
              <div className="flex justify-between items-baseline pb-1 mb-1" style={{ borderBottom: `2px solid ${W}` }}>
                <span className="font-bold text-[14px]">{n.id}</span>
                <span className="text-[11px] font-bold opacity-60">{n.role}</span>
              </div>
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between items-baseline text-[12px]">
                  <span className="font-bold opacity-60">{r.label}</span>
                  <span className="font-bold text-[15px]" style={{ color: r.v.color }}>
                    {r.v.text}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-baseline text-[12px] py-1">
                <span className="font-bold opacity-60">STATUS</span>
                {!live ? (
                  <span className="font-bold">--</span>
                ) : n.status === "OK" ? (
                  <span className="font-bold" style={{ color: G }}>
                    OK
                  </span>
                ) : n.status === "CRITICAL" ? (
                  <span className="brutal-alert font-bold px-1">CRITICAL</span>
                ) : n.status === "SEVERED" ? (
                  <span className="font-bold" style={{ color: R }}>
                    SEVERED
                  </span>
                ) : (
                  <span className="font-bold">DRAINED</span>
                )}
              </div>
              {!live ? null : exec ? (
                <div className="text-[11px] font-bold py-1" style={{ color: G }}>
                  EXECUTED {exec.cmd} → rc=0
                </div>
              ) : (
                <div className="flex gap-1">
                  {triggersFor(n.status).map((t) => (
                    <button
                      key={t.cmd}
                      onClick={() => runCommand(n.id, t.cmd)}
                      className="flex-1 text-[10px] font-bold py-1 px-1"
                      style={{ border: `2px solid ${t.color}`, color: t.color, background: "#000000" }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* LOG STREAM + INCIDENT TIMELINE */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-2 pt-2 items-start">
        <div>
          <div className="flex items-center gap-2 py-1">
            <h2 className="text-[13px] font-bold whitespace-nowrap">LOG STREAM — NEWEST FIRST</h2>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="FILTER"
              className="flex-1 min-w-0 text-[12px] font-bold px-2 py-1"
              style={{ border: `2px solid ${W}`, background: "#000000", color: G, outline: "none" }}
            />
            <span className="text-[11px] font-bold opacity-60 whitespace-nowrap">
              {shownLogs.length} / {logs.length}
            </span>
          </div>
          <table className="w-full border-collapse text-[12px]" style={{ border: `2px solid ${W}` }}>
            <thead>
              <tr>
                {["TS", "LVL", "NODE", "MESSAGE"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-bold text-[11px] opacity-60 px-2 py-1"
                    style={{ borderBottom: `2px solid ${W}` }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shownLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 py-1 font-bold" style={{ color: G }}>
                    {logs.length === 0 ? "AWAITING TELEMETRY" : "0 MATCHES"}
                  </td>
                </tr>
              ) : (
                shownLogs.map((l) => {
                  const c = l.level === "ERROR" ? R : G
                  return (
                    <tr key={l.id} style={{ color: c }}>
                      <td className="px-2 py-[1px] whitespace-nowrap">{l.ts}</td>
                      <td className="px-2 py-[1px] font-bold">{l.level}</td>
                      <td className="px-2 py-[1px] whitespace-nowrap">{l.node}</td>
                      <td className="px-2 py-[1px] w-full">{l.msg}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div>
          <div className="flex items-center gap-2 py-1">
            <h2 className="text-[13px] font-bold whitespace-nowrap">INCIDENT TIMELINE — {timeline.length} EVENT(S)</h2>
            <span className="flex-1" />
            <button
              onClick={exportTimeline}
              className="text-[11px] font-bold px-2 py-1"
              style={{ border: `2px solid ${W}`, color: W, background: "#000000" }}
            >
              EXPORT TIMELINE
            </button>
            <button
              onClick={purgeTimeline}
              className="text-[11px] font-bold px-2 py-1"
              style={{ border: `2px solid ${R}`, color: R, background: "#000000" }}
            >
              PURGE TIMELINE
            </button>
          </div>
          <table className="w-full border-collapse text-[12px]" style={{ border: `2px solid ${W}` }}>
            <thead>
              <tr>
                {["TS", "TYPE", "NODE", "DETAIL"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-bold text-[11px] opacity-60 px-2 py-1"
                    style={{ borderBottom: `2px solid ${W}` }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeline.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 py-1 font-bold" style={{ color: G }}>
                    NO EVENTS RECORDED
                  </td>
                </tr>
              ) : (
                timeline.map((r) => {
                  const c = r.type === "ALERT" ? R : r.type === "RECOVERY" ? G : W
                  return (
                    <tr key={r.id}>
                      <td className="px-2 py-[1px] whitespace-nowrap" style={{ color: G }}>
                        {r.ts}
                      </td>
                      <td className="px-2 py-[1px] font-bold" style={{ color: c }}>
                        {r.type}
                      </td>
                      <td className="px-2 py-[1px] whitespace-nowrap" style={{ color: G }}>
                        {r.node}
                      </td>
                      <td className="px-2 py-[1px] w-full" style={{ color: c }}>
                        {r.detail}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
