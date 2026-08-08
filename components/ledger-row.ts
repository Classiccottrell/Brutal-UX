// Pure validation for the Ledger demo component's add-row form.

export type RowValidation =
  | { ok: true; task: string; value: number }
  | { ok: false; taskBad: boolean; valueBad: boolean }

export function validateRow(task: string, value: string): RowValidation {
  const t = task.trim()
  const v = parseFloat(value)
  const taskBad = t.length === 0
  const valueBad = !Number.isFinite(v)
  if (taskBad || valueBad) return { ok: false, taskBad, valueBad }
  return { ok: true, task: t, value: v }
}
