import { Building2, Dog, Star, Store } from 'lucide-react'

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

export function OwnershipBadge({
  ownership,
  className,
}: {
  ownership: string | null
  className?: string
}) {
  if (ownership === 'independent') {
    return (
      <Badge
        variant="secondary"
        className={`gap-1 bg-accent text-accent-foreground ${className ?? ''}`}
      >
        <Store className="size-3.5" />
        Independent
      </Badge>
    )
  }
  if (ownership === 'chain') {
    return (
      <Badge
        variant="secondary"
        className={`gap-1 bg-muted text-muted-foreground ${className ?? ''}`}
      >
        <Building2 className="size-3.5" />
        Chain
      </Badge>
    )
  }
  return null
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
