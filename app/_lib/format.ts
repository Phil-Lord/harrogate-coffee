// Map the numeric 1–10 price level onto 1–5 £ signs for display.
export function priceLabel(level: number | null | undefined): string {
  if (level == null) return ''
  const count = Math.min(5, Math.max(1, Math.round(level / 2)))
  return '£'.repeat(count)
}
