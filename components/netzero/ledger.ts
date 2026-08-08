// NetZero ledger persistence + export. Pure functions: no localStorage, no
// DOM. Callers (the page) own the actual storage/Blob/anchor mechanics.

import { centsToDecimalString } from "./money.mjs"

export type Entry = { id: string; date: string /* ISO yyyy-mm-dd */; desc: string; cents: number }
export type Ledger = { start: number; entries: Entry[] }

export const LEDGER_STORAGE_KEY = "netzero.v1"

/**
 * Parse a raw localStorage string into a Ledger, dropping any entry that
 * doesn't match the expected shape. Returns null for missing/malformed/
 * corrupt input rather than throwing.
 */
export function parseStoredLedger(raw: string | null): Ledger | null {
  if (!raw) return null
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof data !== "object" || data === null) return null
  const { start, entries } = data as { start?: unknown; entries?: unknown }
  if (typeof start !== "number" || !Number.isSafeInteger(start)) return null
  if (!Array.isArray(entries)) return null
  const clean = entries.filter(
    (e): e is Entry =>
      typeof e === "object" && e !== null &&
      typeof (e as Entry).id === "string" &&
      typeof (e as Entry).date === "string" &&
      typeof (e as Entry).desc === "string" &&
      typeof (e as Entry).cents === "number" &&
      Number.isSafeInteger((e as Entry).cents)
  )
  return { start, entries: clean }
}

/** CSV text for a ledger: header, starting liquidity, then every entry. */
export function buildLedgerCsv(ledger: Ledger): string {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`
  const lines = [
    "date,description,amount",
    `,${esc("STARTING LIQUIDITY")},${centsToDecimalString(ledger.start)}`,
    ...ledger.entries.map((e) => `${e.date},${esc(e.desc)},${centsToDecimalString(e.cents)}`),
  ]
  return lines.join("\n") + "\n"
}
