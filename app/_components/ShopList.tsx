import { CoffeeShopCard } from '@/app/_components/CoffeeShopCard'
import { EmptyState } from '@/app/_components/EmptyState'
import type { Shop } from '@/app/_lib/shop'

// These cards' images load eagerly, so the first screen paints complete.
const ABOVE_THE_FOLD = 3

export function ShopList({ shops }: { shops: Shop[] }) {
  if (shops.length === 0) {
    return <EmptyState>No coffee shops match those filters.</EmptyState>
  }

  return (
    <ul className="flex flex-col gap-4">
      {shops.map((shop, index) => (
        <li key={shop._id}>
          <CoffeeShopCard shop={shop} priority={index < ABOVE_THE_FOLD} />
        </li>
      ))}
    </ul>
  )
}
