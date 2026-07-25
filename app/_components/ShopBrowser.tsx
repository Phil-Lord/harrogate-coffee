'use client'

import { useMemo, useState } from 'react'

import { ShopFilterBar } from '@/app/_components/ShopFilterBar'
import { ShopList } from '@/app/_components/ShopList'
import { filterShops, sortShops, type Shop, type ShopFilters, type ShopSort } from '@/app/_lib/shop'

export function ShopBrowser({ shops }: { shops: Shop[] }) {
  const [filters, setFilters] = useState<ShopFilters>({
    independentOnly: false,
    dogFriendlyOnly: false,
  })
  const [sort, setSort] = useState<ShopSort>('rating')

  // A few hundred shops at most, so this is instant and needs no round-trip.
  const visible = useMemo(
    () => sortShops(filterShops(shops, filters), sort),
    [shops, filters, sort],
  )

  return (
    <>
      <ShopFilterBar
        filters={filters}
        sort={sort}
        onToggleFilter={(filter) =>
          setFilters((current) => ({ ...current, [filter]: !current[filter] }))
        }
        onToggleSort={() => setSort((current) => (current === 'rating' ? 'value' : 'rating'))}
      />
      <ShopList shops={visible} />
    </>
  )
}
