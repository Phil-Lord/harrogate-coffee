// Map the 1–10 affordability score onto 1–5 £ signs. Affordability runs the
// opposite way to the badge (10 is the cheapest), and so the fewest £ signs.
export function priceLabel(affordability: number | null | undefined): string {
  if (affordability == null) return ''
  const count = Math.min(5, Math.max(1, Math.round((11 - affordability) / 2)))
  return '£'.repeat(count)
}
