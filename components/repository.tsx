"use client"

import { useState } from "react"

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="brutal-border p-4">
      <h3 className="text-[13px] font-bold uppercase border-b-2 border-black pb-2 mb-4">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function Repository() {
  const [inverted, setInverted] = useState(false)

  function trigger() {
    const next = !inverted
    document.documentElement.classList.toggle("brutal-inverted", next)
    setInverted(next)
  }

  return (
    <section className="brutal-divider py-8">
      <style>{`html.brutal-inverted { filter: invert(1); }`}</style>
      {inverted && (
        <div
          className="w-full py-3 px-4 font-bold uppercase text-center mb-6"
          style={{ background: "var(--brutal-red)", color: "var(--brutal-white)" }}
        >
          CONSEQUENCE DELIVERED. NO ANIMATION. NO APOLOGY.
        </div>
      )}
      <h2 className="text-[32px] font-bold uppercase mb-6">
        SECTION 02 — BRUTAL COMPONENT REPOSITORY
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="BUTTONS. THEY DO ONE THING.">
          <div className="flex flex-wrap gap-3">
            <button className="brutal-btn">DEFAULT</button>
            <button className="brutal-btn bg-black text-white">HOVER = INVERT</button>
            <button
              className="brutal-btn"
              style={{
                background: "var(--brutal-red)",
                color: "var(--brutal-white)",
                borderColor: "var(--brutal-red)",
              }}
            >
              ACTIVE = RED
            </button>
            <button className="brutal-btn opacity-100 line-through" disabled>
              DISABLED. DEAL WITH IT.
            </button>
          </div>
        </Card>

        <Card title="INPUTS. TYPE OR LEAVE.">
          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-bold uppercase">
              TEXT
              <input className="brutal-input w-full mt-1" type="text" placeholder="STATE YOUR BUSINESS" />
            </label>
            <label className="text-[13px] font-bold uppercase">
              NUMBER
              <input className="brutal-input w-full mt-1" type="number" placeholder="0" />
            </label>
          </div>
        </Card>

        <Card title="SELECTION. BINARY OR LISTED.">
          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-bold uppercase flex items-center gap-2">
              <input type="checkbox" className="size-5 accent-black" defaultChecked />
              CHECKED MEANS YES
            </label>
            <label className="text-[13px] font-bold uppercase">
              NATIVE SELECT. NO CUSTOM DROPDOWN.
              <select className="brutal-input w-full mt-1 font-bold uppercase" defaultValue="ONE">
                <option>ONE</option>
                <option>TWO</option>
                <option>THREE</option>
              </select>
            </label>
          </div>
        </Card>

        <Card title="TABLE. ROWS AND RULES.">
          <table className="w-full border-2 border-black border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-2 border-black p-2 text-left uppercase">KEY</th>
                <th className="border-2 border-black p-2 text-left uppercase">VALUE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-2 border-black p-2">ANIMATIONS</td>
                <td className="border-2 border-black p-2 font-bold">0</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-2">SHADOWS</td>
                <td className="border-2 border-black p-2 font-bold">0</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-2">EXCUSES</td>
                <td className="border-2 border-black p-2 font-bold">0</td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card title="SLAPSTICK CAUSE-AND-EFFECT. LIVE.">
          <button className="brutal-btn text-2xl w-full py-6" onClick={trigger}>
            {inverted ? "REVERT SLAPSTICK ACTION" : "TRIGGER SLAPSTICK ACTION"}
          </button>
          <p className="text-[13px] font-bold uppercase mt-3">
            INPUT → CONSEQUENCE. SAME FRAME. THE WHOLE PAGE PAYS.
          </p>
        </Card>
      </div>
    </section>
  )
}
