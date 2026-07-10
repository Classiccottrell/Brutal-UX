"use client"

import Link from "next/link"
import { useState } from "react"

type Entry = { id: number; date: string; desc: string; amount: number }

let nextId = 1

export default function NetZero() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState("")
  const [descBad, setDescBad] = useState(false)
  const [amountBad, setAmountBad] = useState(false)

  function add(sign: 1 | -1) {
    const d = desc.trim()
    const a = parseFloat(amount)
    const badD = d.length === 0
    const badA = !Number.isFinite(a) || a <= 0
    setDescBad(badD)
    setAmountBad(badA)
    if (badD || badA) return
    setEntries([
      ...entries,
      { id: nextId++, date: new Date().toISOString().slice(0, 10), desc: d, amount: sign * a },
    ])
    setDesc("")
    setAmount("")
  }

  const net = entries.reduce((s, e) => s + e.amount, 0)
  const negative = net < 0

  return (
    <main className="bg-white text-black max-w-5xl mx-auto px-4">
      <header className="py-4 border-b-2 border-black flex items-baseline gap-4">
        <Link href="/" className="underline text-[13px] font-bold uppercase" style={{ color: "var(--brutal-blue)" }}>
          ← BRUTAL UX
        </Link>
        <h1 className="text-[24px] font-bold uppercase">
          NETZERO — THE NO-BULLSH*T BUDGET TRACKER
        </h1>
      </header>

      <section className="py-8">
        <div
          className="brutal-border p-6 text-center font-bold leading-none"
          style={
            negative
              ? { background: "var(--brutal-red)", color: "var(--brutal-white)", fontSize: 64 }
              : { background: "var(--brutal-white)", color: "var(--brutal-black)", fontSize: 64 }
          }
        >
          {negative ? "-" : ""}${Math.abs(net).toFixed(2)}
        </div>
        <p className="text-[13px] font-bold uppercase mt-2">NET LIQUIDITY. THAT IS ALL.</p>
      </section>

      <section className="brutal-divider py-8">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <label className="text-[13px] font-bold uppercase flex-1">
            DESCRIPTION
            <input
              className="brutal-input w-full mt-1"
              style={descBad ? { borderColor: "var(--brutal-red)" } : undefined}
              type="text"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value)
                setDescBad(false)
              }}
            />
          </label>
          <label className="text-[13px] font-bold uppercase w-full md:w-40">
            AMOUNT
            <input
              className="brutal-input w-full mt-1"
              style={amountBad ? { borderColor: "var(--brutal-red)" } : undefined}
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setAmountBad(false)
              }}
            />
          </label>
          <button className="brutal-btn self-end" onClick={() => add(1)}>
            + INCOME
          </button>
          <button className="brutal-btn self-end" onClick={() => add(-1)}>
            – EXPENSE
          </button>
        </div>

        <table className="w-full border-2 border-black border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-2 border-black p-2 text-left uppercase w-32">DATE</th>
              <th className="border-2 border-black p-2 text-left uppercase">DESCRIPTION</th>
              <th className="border-2 border-black p-2 text-right uppercase w-32">AMOUNT</th>
              <th className="border-2 border-black p-2 text-left uppercase w-28">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td className="border-2 border-black p-2 font-bold uppercase" colSpan={4}>
                  ZERO ENTRIES. ZERO DOLLARS. ZERO SYMPATHY.
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id}>
                  <td className="border-2 border-black p-2">{e.date}</td>
                  <td className="border-2 border-black p-2">{e.desc}</td>
                  <td
                    className="border-2 border-black p-2 text-right font-bold"
                    style={e.amount < 0 ? { color: "var(--brutal-red)" } : undefined}
                  >
                    {e.amount < 0 ? "-" : "+"}${Math.abs(e.amount).toFixed(2)}
                  </td>
                  <td className="border-2 border-black p-2">
                    <button
                      className="brutal-btn px-2 py-1 text-[13px]"
                      onClick={() => setEntries(entries.filter((x) => x.id !== e.id))}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="brutal-divider py-8">
        <div className="brutal-border p-4">
          <p className="text-[16px] font-bold uppercase">
            NO GRAPHS. NO CATEGORIES. NO INSIGHTS. YOUR NUMBER, INSTANTLY.
          </p>
        </div>
      </section>
    </main>
  )
}
