// The overall rating is the equal-weighted mean of the three category scores,
// computed rather than stored so it can never drift from them. The site gets it
// from GROQ (see COFFEE_SHOPS_QUERY); this mirrors that arithmetic for the
// Studio preview — keep the two in step.
export const SCORE_CATEGORIES = ['vibe', 'coffee', 'affordability'] as const

type Scores = Partial<Record<(typeof SCORE_CATEGORIES)[number], number | null>>

export function overallRating(scores: Scores | null | undefined): number | null {
  const values = SCORE_CATEGORIES.map((category) => scores?.[category])
  // A partial set would silently skew the mean, so score all three or none.
  if (values.some((value) => typeof value !== 'number')) return null
  const total = (values as number[]).reduce((sum, value) => sum + value, 0)
  return Math.round((total / values.length) * 10) / 10
}
