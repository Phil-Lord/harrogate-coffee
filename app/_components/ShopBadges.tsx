import { Building2, Dog, Star, Store } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { priceLabel } from '@/app/_lib/format'
import { isChain, isDogFriendly, isIndependent, type Shop } from '@/app/_lib/shop'

// Structural, so the detail page's shop type fits too.
type BadgedShop = Pick<Shop, 'ownership' | 'dogFriendly' | 'affordability' | 'rating'>

// One badge order wherever they appear; each renders nothing when unset.
export function ShopBadgeRow({ shop, className }: { shop: BadgedShop; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <OwnershipBadge ownership={shop.ownership} />
      <DogFriendlyBadge dogFriendly={shop.dogFriendly} />
      <PriceBadge affordability={shop.affordability} />
      <RatingBadge rating={shop.rating} />
    </div>
  )
}

function RatingBadge({ rating }: { rating: Shop['rating'] }) {
  if (rating == null) return null
  return (
    <Badge className="shrink-0 gap-1">
      <Star className="fill-current" />
      {rating}/10
    </Badge>
  )
}

function DogFriendlyBadge({ dogFriendly }: { dogFriendly: Shop['dogFriendly'] }) {
  if (!isDogFriendly(dogFriendly)) return null
  return (
    <Badge
      variant="secondary"
      className="gap-1 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
    >
      <Dog className="size-3.5" />
      Dog friendly
    </Badge>
  )
}

function OwnershipBadge({ ownership }: { ownership: Shop['ownership'] }) {
  if (isIndependent(ownership)) {
    return (
      <Badge variant="secondary" className="gap-1 bg-accent text-accent-foreground">
        <Store className="size-3.5" />
        Independent
      </Badge>
    )
  }
  if (isChain(ownership)) {
    return (
      <Badge variant="secondary" className="gap-1 bg-muted text-muted-foreground">
        <Building2 className="size-3.5" />
        Chain
      </Badge>
    )
  }
  return null
}

function PriceBadge({ affordability }: { affordability: Shop['affordability'] }) {
  const label = priceLabel(affordability)
  if (!label) return null
  return <Badge variant="secondary">{label}</Badge>
}
