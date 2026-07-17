import { Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { priceLabel } from '@/app/_lib/format'

export function RatingBadge({ rating }: { rating: number | null }) {
  if (rating == null) return null
  return (
    <Badge className="shrink-0 gap-1">
      <Star className="fill-current" />
      {rating}/10
    </Badge>
  )
}

export function PriceBadge({
  affordability,
  className,
}: {
  affordability: number | null
  className?: string
}) {
  const label = priceLabel(affordability)
  if (!label) return null
  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  )
}
