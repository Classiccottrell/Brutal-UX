"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { parseDollarsToCents, formatCents } from "@/components/netzero/money.mjs"
import { Comments } from "@/components/comments"
import { PositionPinsLayer } from "@/components/comments/position-pins-layer"
import {
  LEDGER_STORAGE_KEY,
  buildLedgerCsv,
  parseStoredLedger,
  type Entry,
  type Ledger,
} from "@/components/netzero/ledger"

const KEY = LEDGER_STORAGE_KEY

function loadLedger(): Ledger | null {
  try {
    return parseStoredLedger(window.localStorage.getItem(KEY))
  } catch {
    return null
  }
}

function saveLedger(ledger: Ledger) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ledger))
  } catch {
    /* storage denied: state still lives in memory this session */
  }
}

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function todayISO(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const RED_BORDER = { borderColor: "var(--brutal-red)" } as const

function Onboarding({ onSet }: { onSet: (startCents: number) => void }) {
  const [value, setValue] = useState("")
  const [bad, setBad] = useState(false)

  function set() {
    const cents = parseDollarsToCents(value)
    if (cents === null) {
      setBad(true)
      return
    }
    onSet(cents)
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="brutal-border p-8 w-full max-w-md">
        <label className="block text-[16px] font-bold uppercase">
          STARTING LIQUIDITY
          <input
            className="brutal-input w-full mt-2 px-2 py-1 text-[16px]"
            style={bad ? RED_BORDER : undefined}
            type="text"
            inputMode="decimal"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setBad(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") set()
            }}
          />
        </label>
        <button className="brutal-btn w-full mt-4 px-3 py-2 uppercase" onClick={set}>
          SET
        </button>
      </div>
    </div>
  )
}

function LedgerScreen({
  ledger,
  commit,
  reset,
}: {
  ledger: Ledger
  commit: (next: Ledger) => void
  reset: () => void
}) {
  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState("")
  const [descBad, setDescBad] = useState(false)
  const [amountBad, setAmountBad] = useState(false)
  const [filter, setFilter] = useState("")

  const net = ledger.entries.reduce((sum, e) => sum + e.cents, ledger.start)
  const negative = net < 0

  const q = filter.toLowerCase()
  const visible = q ? ledger.entries.filter((e) => e.desc.toLowerCase().includes(q)) : ledger.entries

  function add(sign: 1 | -1) {
    const d = desc.trim()
    const cents = parseDollarsToCents(amount)
    const badD = d.length === 0
    const badA = cents === null
    setDescBad(badD)
    setAmountBad(badA)
    if (badD || cents === null) return
    const entry: Entry = {
      id: newId(),
      date: todayISO(),
      desc: d,
      cents: sign * Math.abs(cents) || 0,
    }
    commit({ ...ledger, entries: [entry, ...ledger.entries] })
    setDesc("")
    setAmount("")
  }

  function remove(id: string) {
    commit({ ...ledger, entries: ledger.entries.filter((e) => e.id !== id) })
  }

  function exportCsv() {
    const blob = new Blob([buildLedgerCsv(ledger)], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "netzero-ledger.csv"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <section className="py-6">
        <div
          className="brutal-border p-4 font-bold leading-none text-[64px] overflow-x-auto"
          style={negative ? { background: "var(--brutal-red)", color: "var(--brutal-white)" } : undefined}
        >
          {formatCents(net)}
        </div>
        <p className="text-[13px] font-bold uppercase mt-2">NET LIQUIDITY. THAT IS ALL.</p>
      </section>

      <section className="brutal-divider py-6">
        <div className="flex flex-col md:flex-row gap-3">
          <label className="text-[13px] font-bold uppercase flex-1">
            DESCRIPTION
            <input
              className="brutal-input w-full mt-1 px-2 py-1 text-[13px]"
              style={descBad ? RED_BORDER : undefined}
              type="text"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value)
                setDescBad(false)
              }}
            />
          </label>
          <label className="text-[13px] font-bold uppercase w-full md:w-44">
            AMOUNT
            <input
              className="brutal-input w-full mt-1 px-2 py-1 text-[13px]"
              style={amountBad ? RED_BORDER : undefined}
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setAmountBad(false)
              }}
            />
          </label>
          <button className="brutal-btn self-end px-3 py-1 text-[13px]" onClick={() => add(1)}>
            + INCOME
          </button>
          <button className="brutal-btn self-end px-3 py-1 text-[13px]" onClick={() => add(-1)}>
            – EXPENSE
          </button>
        </div>
      </section>

      <section className="brutal-divider py-6">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-end mb-3">
          <label className="text-[13px] font-bold uppercase flex-1 w-full">
            FILTER
            <input
              className="brutal-input w-full mt-1 px-2 py-1 text-[13px]"
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </label>
          <p className="text-[13px] font-bold uppercase whitespace-nowrap">
            {visible.length} OF {ledger.entries.length} ROWS
          </p>
        </div>

        <table className="w-full border-2 border-black border-collapse text-[13px] leading-tight">
          <thead>
            <tr>
              <th className="border-2 border-black px-2 py-1 text-left uppercase w-28">DATE</th>
              <th className="border-2 border-black px-2 py-1 text-left uppercase">DESCRIPTION</th>
              <th className="border-2 border-black px-2 py-1 text-right uppercase w-32">AMOUNT</th>
              <th className="border-2 border-black px-2 py-1 text-left uppercase w-24">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td className="border-2 border-black px-2 py-1 font-bold uppercase" colSpan={4}>
                  NOTHING RECORDED. ENTER A TRANSACTION OR LEAVE.
                </td>
              </tr>
            ) : (
              visible.map((e) => (
                <tr key={e.id}>
                  <td className="border-2 border-black px-2 py-1 whitespace-nowrap">{e.date}</td>
                  <td className="border-2 border-black px-2 py-1">{e.desc}</td>
                  <td className="border-2 border-black px-2 py-1 text-right font-bold whitespace-nowrap">
                    {formatCents(e.cents)}
                  </td>
                  <td className="border-2 border-black px-2 py-1">
                    <button
                      className="brutal-btn px-2 py-0 text-[13px]"
                      onClick={() => remove(e.id)}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button className="brutal-btn mt-3 px-3 py-1 text-[13px]" onClick={exportCsv}>
          EXPORT CSV
        </button>
      </section>

      <section className="brutal-divider py-6">
        <div className="brutal-border p-4">
          <p className="text-[16px] font-bold uppercase">
            NO GRAPHS. NO CATEGORIES. NO INSIGHTS. YOUR NUMBER, INSTANTLY.
          </p>
        </div>
        <button className="brutal-btn mt-6 px-2 py-1 text-[13px]" onClick={reset}>
          RESET LEDGER. NO UNDO.
        </button>
      </section>
    </>
  )
}

export default function NetZero() {
  // undefined = not hydrated yet; null = no stored ledger (onboarding).
  const [ledger, setLedger] = useState<Ledger | null | undefined>(undefined)

  // localStorage is read only after mount; the page prerenders statically.
  useEffect(() => {
    setLedger(loadLedger())
  }, [])

  // Write-through: persist synchronously in the same tick as the state change.
  function commit(next: Ledger) {
    saveLedger(next)
    setLedger(next)
  }

  function reset() {
    try {
      window.localStorage.removeItem(KEY)
    } catch {
      /* nothing to wipe */
    }
    setLedger(null)
  }

  return (
    <main className="bg-white text-black max-w-5xl mx-auto px-4 relative">
      <PositionPinsLayer />
      <header className="py-4 border-b-2 border-black flex items-baseline gap-4 flex-wrap">
        <Link href="/" className="underline text-[13px] font-bold uppercase">
          ← BRUTAL UX
        </Link>
        <h1 className="text-[24px] font-bold uppercase">NETZERO — YOUR NUMBER, INSTANTLY.</h1>
      </header>

      {ledger === undefined ? (
        <p className="py-10 text-[16px] font-bold uppercase">LOADING LEDGER.</p>
      ) : ledger === null ? (
        <Onboarding onSet={(startCents) => commit({ start: startCents, entries: [] })} />
      ) : (
        <LedgerScreen ledger={ledger} commit={commit} reset={reset} />
      )}

      <section className="brutal-divider py-8">
        <h2 className="text-[32px] font-bold uppercase mb-6">DISCUSSION</h2>
        <Comments />
      </section>
    </main>
  )
}
