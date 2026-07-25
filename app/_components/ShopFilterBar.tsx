'use client'

import { CirclePoundSterling, Dog, Star, Store } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FixedBar } from '@/app/_components/FixedBar'
import { pageContainer } from '@/app/_lib/layout'
import type { ShopFilters, ShopSort } from '@/app/_lib/shop'

// Tighter below `sm` so all three fit a 375px phone.
const barButton = 'px-2.5 text-xs sm:px-3 sm:text-sm'

export function ShopFilterBar({
  filters,
  sort,
  onToggleFilter,
  onToggleSort,
}: {
  filters: ShopFilters
  sort: ShopSort
  onToggleFilter: (filter: keyof ShopFilters) => void
  onToggleSort: () => void
}) {
  return (
    <FixedBar height="h-[var(--filter-bar-h)]" className="top-[var(--header-h)] z-40">
      {/* Scrolls rather than overflowing on a narrow phone. */}
      <div className={cn(pageContainer, 'flex h-full items-center gap-1.5 overflow-x-auto sm:gap-2')}>
        <FilterButton active={filters.independentOnly} onClick={() => onToggleFilter('independentOnly')}>
          <Store />
          Independent
        </FilterButton>
        <FilterButton active={filters.dogFriendlyOnly} onClick={() => onToggleFilter('dogFriendlyOnly')}>
          <Dog />
          Dog friendly
        </FilterButton>

        <Button size="sm" variant="secondary" className={cn(barButton, 'ml-auto')} onClick={onToggleSort}>
          {sort === 'rating' ? <Star className="fill-current" /> : <CirclePoundSterling />}
          <span className="sr-only">Sort by: </span>
          <SortLabel active={sort} rating="Rating" value="Value" className="sm:hidden" />
          <SortLabel active={sort} rating="Top rated" value="Best value" className="hidden sm:grid" />
        </Button>
      </div>
    </FixedBar>
  )
}

// Both labels share one grid cell, so the button is always as wide as
// the longer of the two and doesn't jump when the sort flips.
function SortLabel({
  active,
  rating,
  value,
  className,
}: {
  active: ShopSort
  rating: string
  value: string
  className?: string
}) {
  return (
    <span className={cn('grid', className)}>
      <span className={cn('col-start-1 row-start-1', active !== 'rating' && 'invisible')}>{rating}</span>
      <span className={cn('col-start-1 row-start-1', active !== 'value' && 'invisible')}>{value}</span>
    </span>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      size="sm"
      variant={active ? 'default' : 'outline'}
      aria-pressed={active}
      onClick={onClick}
      className={barButton}
    >
      {children}
    </Button>
  )
}
