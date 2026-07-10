// NetZero money math. Integer cents only. No floats near money.
// .mjs with JSDoc types so `node --test` (native) and `tsc --noEmit` both
// consume it without tsconfig changes (importing "./money.ts" would need
// allowImportingTsExtensions).

const PARSE_RE = /^([-+]?)\$?(\d{1,3}(?:,\d{3})*|\d*)(?:\.(\d{1,2}))?$/

/**
 * Parse a user-typed dollar amount into signed integer cents.
 * Accepts "1234", "1,234.56", "$12.50", "-40", ".75".
 * Returns null for garbage, bad comma grouping, >2 decimals, or overflow.
 * @param {string} input
 * @returns {number | null}
 */
export function parseDollarsToCents(input) {
  if (typeof input !== "string") return null
  const m = PARSE_RE.exec(input.trim())
  if (!m) return null
  const [, sign, whole, frac] = m
  if (!whole && !frac) return null
  const dollars = Number(whole.replace(/,/g, "") || "0")
  const cents = frac ? Number(frac.padEnd(2, "0")) : 0
  const total = dollars * 100 + cents
  if (!Number.isSafeInteger(total)) return null
  return sign === "-" ? -total || 0 : total
}

/**
 * Format signed integer cents as grouped dollars: 123456 -> "$1,234.56",
 * -4000 -> "-$40.00".
 * @param {number} cents
 * @returns {string}
 */
export function formatCents(cents) {
  const s = String(Math.abs(cents)).padStart(3, "0")
  const grouped = s.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `${cents < 0 ? "-" : ""}$${grouped}.${s.slice(-2)}`
}

/**
 * Signed plain decimal dollars for CSV: -4000 -> "-40.00". No grouping.
 * @param {number} cents
 * @returns {string}
 */
export function centsToDecimalString(cents) {
  const s = String(Math.abs(cents)).padStart(3, "0")
  return `${cents < 0 ? "-" : ""}${s.slice(0, -2)}.${s.slice(-2)}`
}
