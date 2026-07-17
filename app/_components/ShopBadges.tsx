import { Dog, Star } from 'lucide-react'

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

export function DogFriendlyBadge({
  dogFriendly,
  className,
}: {
  dogFriendly: string | null
  className?: string
}) {
  if (!(dogFriendly === 'yes')) return null
  return (
    <Badge
      variant="secondary"
      className={`gap-1 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 ${className ?? ''}`}
    >
      <Dog className="size-3.5" />
      Dog friendly
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
