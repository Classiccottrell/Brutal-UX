"use client"

import { useState } from "react"

type Row = { id: number; task: string; value: number }

let nextId = 1

export function Ledger() {
  const [rows, setRows] = useState<Row[]>([])
  const [task, setTask] = useState("")
  const [value, setValue] = useState("")
  const [taskBad, setTaskBad] = useState(false)
  const [valueBad, setValueBad] = useState(false)

  function add() {
    const t = task.trim()
    const v = parseFloat(value)
    const badT = t.length === 0
    const badV = !Number.isFinite(v)
    setTaskBad(badT)
    setValueBad(badV)
    if (badT || badV) return
    setRows([...rows, { id: nextId++, task: t, value: v }])
    setTask("")
    setValue("")
  }

  function del(id: number) {
    setRows(rows.filter((r) => r.id !== id))
  }

  const total = rows.reduce((s, r) => s + r.value, 0)

  return (
    <div className="brutal-border p-4">
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <label className="text-[13px] font-bold uppercase flex-1">
          TASK
          <input
            className="brutal-input w-full mt-1"
            style={taskBad ? { borderColor: "var(--brutal-red)" } : undefined}
            type="text"
            value={task}
            onChange={(e) => {
              setTask(e.target.value)
              setTaskBad(false)
            }}
          />
        </label>
        <label className="text-[13px] font-bold uppercase w-full md:w-40">
          VALUE ($)
          <input
            className="brutal-input w-full mt-1"
            style={valueBad ? { borderColor: "var(--brutal-red)" } : undefined}
            type="number"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setValueBad(false)
            }}
          />
        </label>
        <button className="brutal-btn self-end" onClick={add}>
          ADD
        </button>
      </div>

      <table className="w-full border-2 border-black border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="border-2 border-black p-2 text-left uppercase w-12">#</th>
            <th className="border-2 border-black p-2 text-left uppercase">TASK</th>
            <th className="border-2 border-black p-2 text-right uppercase w-32">VALUE</th>
            <th className="border-2 border-black p-2 text-left uppercase w-28">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="border-2 border-black p-2 font-bold uppercase" colSpan={4}>
                NOTHING. ADD A TASK OR LEAVE.
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.id}>
                <td className="border-2 border-black p-2">{i + 1}</td>
                <td className="border-2 border-black p-2">{r.task}</td>
                <td className="border-2 border-black p-2 text-right">${r.value.toFixed(2)}</td>
                <td className="border-2 border-black p-2">
                  <button
                    className="brutal-btn px-2 py-1 text-[13px]"
                    onClick={() => del(r.id)}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))
          )}
          <tr>
            <td className="border-2 border-black p-2 font-bold uppercase" colSpan={2}>
              TOTAL
            </td>
            <td className="border-2 border-black p-2 text-right font-bold">
              ${total.toFixed(2)}
            </td>
            <td className="border-2 border-black p-2" />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
