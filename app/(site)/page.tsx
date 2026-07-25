import Link from 'next/link'

import { client } from '@/sanity/lib/client'
import { COFFEE_SHOPS_QUERY } from '@/sanity/lib/queries'
import type { COFFEE_SHOPS_QUERY_RESULT } from '@/sanity.types'
import { pageContainer } from '@/app/_lib/layout'

// Statically generated, refreshed at most hourly (ISR).
export const revalidate = 3600

export default async function Home() {
  const shops = await client.fetch<COFFEE_SHOPS_QUERY_RESULT>(COFFEE_SHOPS_QUERY)

  return (
    <main className={cn(pageContainer, 'flex-1 py-12')}>
      {shops.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          No coffee shops yet — add some in the{' '}
          <Link href="/studio" className="underline">
            Studio
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {shops.map((shop, index) => (
            <li key={shop._id}>
              <CoffeeShopCard shop={shop} priority={index < 3} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
